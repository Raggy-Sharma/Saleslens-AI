import datetime
from pydantic import BaseModel
from sqlalchemy.sql.functions import grouping_sets

class UploadResponse(BaseModel):
    id: str
    filename: str
    report_date: datetime.date
    uploaded_at: datetime.datetime
    status: str

    class Config:
        from_attributes = True

class DailySummaryResponse(BaseModel):
    id: str
    date: datetime.date
    net_sales: float
    gross_sales: float
    discount: float
    gst: float
    service_charge: float
    round_off: float
    foot_fall: int
    transactions: int
    apc: float | None  # Computed: net_sales / foot_fall

    class Config:
        from_attributes = True

class DepartmentSalesResponse(BaseModel):
    id: str
    date: datetime.date
    department: str
    lunch_sales: float
    hi_tea_sales: float
    dinner_sales: float
    day_total: float

    class Config:
        from_attributes = True

class PaymentMethodResponse(BaseModel):
    id: str
    date: datetime.date
    payment_method: str
    digital_sales: float
    actual: float
    variance: float

    class Config:
        from_attributes = True

class CachedInsightResponse(BaseModel):
    id: str  # e.g., fbs-insight-09052026
    date: datetime.date
    insights_json: dict
    generated_at: datetime.datetime

    class Config:
        from_attributes = True


class SummaryResponse(BaseModel):
    report_date: datetime.date
    day_of_week: str
    net_sales: float
    gross_sales: float
    foot_fall: int
    transactions: int
    apc: float | None
    vs_last_weekday_net: float | None  # percentage change
    vs_last_weekday_gross: float | None
    vs_last_weekday_foot_fall: float | None
    vs_last_weekday_transactions: float | None

class TrendDataPoint(BaseModel):
    date: datetime.date
    net_sales: float
    gross_sales: float

class TrendResponse(BaseModel):
    days: int
    data: list[TrendDataPoint]


class MTDResponse(BaseModel):
    month: str
    net_sales_mtd: float
    gross_sales_mtd: float
    days_elapsed: int
    days_remaining: int
    total_days_in_month: int
    prev_month_daily_avg_net: float
    prev_month_daily_avg_gross: float

class SameDayDataPoint(BaseModel):
    date: datetime.date
    net_sales: float
    gross_sales: float

class SameDayHistoryResponse(BaseModel):
    day_of_week: str
    data: list[SameDayDataPoint]

class WeekdayAverageResponse(BaseModel):
    day_of_week: str
    avg_net_sales: float
    avg_gross_sales: float
    avg_foot_fall: float
    sample_count: int  # how many of this weekday we have data for
