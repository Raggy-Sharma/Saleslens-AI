from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract, delete
from datetime import timedelta, datetime
import calendar

from app.db.session import get_db
from app.models.models import DailySummary, DepartmentSales, PaymentMethod, Upload
from app.models.schemas import (
    SummaryResponse, TrendResponse, TrendDataPoint,
    MTDResponse, SameDayHistoryResponse, SameDayDataPoint,
    WeekdayAverageResponse
)

router = APIRouter(prefix="/dashboard", tags=["dashboards"])

async def get_latest_date(db: AsyncSession):
    result = await db.execute(select(func.max(DailySummary.date)))
    latest = result.scalar_one_or_none()
    if not latest:
        raise HTTPException(404, "No data uploaded yet")
    return latest

async def get_summary_for_date(db: AsyncSession, date: datetime):
    print(f"DATE: {date}")
    result = await db.execute(select(DailySummary).where(DailySummary.date == date))
    summary = result.scalar_one_or_none()
    if not summary:
        raise HTTPException(404, "No data uploaded for this date")
    return summary


#Dashboard summary endpoint
# Returns the latest day's key metrics with a same-weekday comparison.
# Finds the latest report date, fetches its summary, computes APC,
# then looks back exactly 7 days to find the same weekday last week
# and calculates the percentage change for net and gross sales.
@router.get("/summary", response_model=SummaryResponse)
async def dashboard_summary(
    date: datetime = None,
    db: AsyncSession = Depends(get_db)
):
    target_date = date if date else await get_latest_date(db)
    summary = await get_summary_for_date(db, target_date)

    weekday_name = target_date.strftime("%A")  # e.g., "Friday"
    apc = summary.net_sales / summary.foot_fall if summary.foot_fall > 0 else None

    # Find same weekday last week
    last_weekday_date = target_date - timedelta(days=7)
    print(f"last_weekday_date: {last_weekday_date}")
    last_weekday = await get_summary_for_date(db, last_weekday_date)

    vs_last_net = None
    vs_last_gross = None
    vs_last_foot_fall = None
    vs_last_transactions = None
    if last_weekday and last_weekday.net_sales > 0:
        vs_last_net = round(((summary.net_sales - last_weekday.net_sales) / last_weekday.net_sales) * 100, 1)
    if last_weekday and last_weekday.gross_sales > 0:
        vs_last_gross = round(((summary.gross_sales - last_weekday.gross_sales) / last_weekday.gross_sales) * 100, 1)
    if last_weekday and last_weekday.foot_fall > 0:
        vs_last_foot_fall = round(((summary.foot_fall - last_weekday.foot_fall) / last_weekday.foot_fall) * 100, 1)
    if last_weekday and last_weekday.transactions > 0:
        vs_last_transactions = round(((summary.transactions - last_weekday.transactions) / last_weekday.transactions) * 100, 1)
    print(f"vs_last_gross: {vs_last_gross}")
    return SummaryResponse(
        report_date=target_date,
        day_of_week=weekday_name,
        net_sales=summary.net_sales,
        gross_sales=summary.gross_sales,
        foot_fall=summary.foot_fall,
        transactions=summary.transactions,
        apc=round(apc, 2) if apc else None,
        vs_last_weekday_net=vs_last_net,
        vs_last_weekday_gross=vs_last_gross,
        vs_last_weekday_foot_fall=vs_last_foot_fall,
        vs_last_weekday_transactions=vs_last_transactions,
    )

# Returns daily net and gross sales for the last N days.
# The 'days' parameter is flexible — frontend can pass 7, 14, 30, or any value.
# Queries all DailySummary rows between (latest_date - days + 1) and latest_date,
# ordered chronologically for direct chart rendering.
@router.get("/trend", response_model=TrendResponse)
async def dashboard_trend(days: int = 7, db: AsyncSession = Depends(get_db)):
    latest_date = await get_latest_date(db)
    start_date = latest_date - timedelta(days=days-1)
    result = await db.execute(
        select(DailySummary)
        .where(DailySummary.date >= start_date)
        .where(DailySummary.date <= latest_date)
        .order_by(DailySummary.date)
    )
    daily_summaries = result.scalars().all()
    trend_data = []
    for summary in daily_summaries:
        trend_data.append(TrendDataPoint(date=summary.date, net_sales=summary.net_sales, gross_sales=summary.gross_sales))
    return TrendResponse(days=days, data=trend_data)

# Returns month-to-date total (net and gross) for the current month,
# along with the number of days elapsed and remaining.
# Also queries last month's average daily net and gross sales so the
# frontend can compute a pace comparison (on track / slightly behind / behind).
# The pace color is a frontend concern — the backend returns raw averages.
@router.get("/mtd", response_model=MTDResponse)
# Returns month-to-date total (net and gross) for the current month,
# along with the number of days elapsed and remaining.
# Also queries last month's average daily net and gross sales so the
# frontend can compute a pace comparison (on track / slightly behind / behind).
# The pace color is a frontend concern — the backend returns raw averages.
@router.get("/mtd", response_model=MTDResponse)
async def dashboard_mtd(db: AsyncSession = Depends(get_db)):
    latest_date = await get_latest_date(db)
    first_of_month = latest_date.replace(day=1)
    _, days_in_month = calendar.monthrange(latest_date.year, latest_date.month)

    # Sum this month's sales
    result = await db.execute(
        select(func.sum(DailySummary.net_sales), func.sum(DailySummary.gross_sales), func.count(DailySummary.id))
        .where(DailySummary.date >= first_of_month)
        .where(DailySummary.date <= latest_date)
    )
    row = result.one()
    net_mtd = row[0] or 0
    gross_mtd = row[1] or 0
    days_elapsed = row[2] or 0

    # Query last month's daily averages for pace comparison
    if latest_date.month == 1:
        prev_month_start = latest_date.replace(year=latest_date.year - 1, month=12, day=1)
    else:
        prev_month_start = latest_date.replace(month=latest_date.month - 1, day=1)
    _, prev_days_in_month = calendar.monthrange(prev_month_start.year, prev_month_start.month)
    prev_month_end = prev_month_start.replace(day=prev_days_in_month)

    prev_result = await db.execute(
        select(func.avg(DailySummary.net_sales), func.avg(DailySummary.gross_sales))
        .where(DailySummary.date >= prev_month_start)
        .where(DailySummary.date <= prev_month_end)
    )
    prev_row = prev_result.one()

    return MTDResponse(
        month=latest_date.strftime("%B %Y"),
        net_sales_mtd=net_mtd,
        gross_sales_mtd=gross_mtd,
        days_elapsed=days_elapsed,
        days_remaining=days_in_month - latest_date.day,
        total_days_in_month=days_in_month,
        prev_month_daily_avg_net=round(prev_row[0] or 0, 2),
        prev_month_daily_avg_gross=round(prev_row[1] or 0, 2),
    )


# Returns the last N occurrences of the same weekday as the latest report.
# If the latest day is a Friday, this returns the previous 4 Fridays.
# Excludes the latest day itself (already shown on the summary card).
# Results are returned in chronological order (oldest first) for the
# history strip to read left-to-right.
@router.get("/same-day-history", response_model=SameDayHistoryResponse)
async def dashboard_same_day_history(limit: int = 4, db: AsyncSession = Depends(get_db)):
    latest_date = await get_latest_date(db)
    weekday_name = latest_date.strftime("%A")

    result = await db.execute(
        select(DailySummary.date, DailySummary.net_sales, DailySummary.gross_sales)
        .where(extract("dow", DailySummary.date) == extract("dow", latest_date))
        .where(DailySummary.date <= latest_date)
        .order_by(DailySummary.date.desc())
        .limit(limit)
    )
    rows = result.all()

    return SameDayHistoryResponse(
        day_of_week=weekday_name,
        data=[SameDayDataPoint(date=row.date, net_sales=row.net_sales, gross_sales=row.gross_sales) for row in reversed(rows)],
    )


# Returns the average net sales, gross sales, and foot fall for the latest
# day's weekday across all historical data. The frontend uses this for:
#   1. Context line: "Your avg Friday: ₹X"
#   2. Benchmark color on the sales card (compare sales vs avg)
#   3. Average APC: computed as avg_net_sales / avg_foot_fall
# Uses sum + count instead of func.avg for foot_fall so the frontend
# can compute a weighted average APC (total net / total foot fall).
@router.get("/weekday-average", response_model=WeekdayAverageResponse)
async def dashboard_weekday_average(db: AsyncSession = Depends(get_db)):
    latest_date = await get_latest_date(db)
    weekday_name = latest_date.strftime("%A")

    result = await db.execute(
        select(
            func.avg(DailySummary.net_sales),
            func.avg(DailySummary.gross_sales),
            func.sum(DailySummary.foot_fall),
            func.count(DailySummary.id),
        )
        .where(extract("dow", DailySummary.date) == extract("dow", latest_date))
    )
    row = result.one()

    sample_count = row[3] or 0
    total_foot_fall = row[2] or 0

    return WeekdayAverageResponse(
        day_of_week=weekday_name,
        avg_net_sales=round(row[0] or 0, 2),
        avg_gross_sales=round(row[1] or 0, 2),
        avg_foot_fall=round(total_foot_fall / sample_count) if sample_count > 0 else 0,
        sample_count=sample_count,
    )

    
@router.delete("/delete") 
async def delete_data_for_date(date: datetime, db: AsyncSession = Depends(get_db)):
    print(f"date: {date}")
    dailSummary = await db.execute(select(DailySummary).where(DailySummary.date == date))
    print(f"dailSummary: {dailSummary}")
    await db.execute(delete(DailySummary).where(DailySummary.date == date))
    await db.execute(delete(DepartmentSales).where(DepartmentSales.date == date))
    await db.execute(delete(PaymentMethod).where(PaymentMethod.date == date))
    await db.execute(delete(Upload).where(Upload.report_date == date))
    await db.commit()
    return {"message": "Data for {date} deleted successfully"}








