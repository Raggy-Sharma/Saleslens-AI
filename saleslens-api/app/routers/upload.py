import os
import shutil
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.constants import UPLOAD_STATUS_PROCESSED

from app.db.session import get_db
from app.config import get_settings
from app.models.models import (
    Upload, DailySummary, DepartmentSales, PaymentMethod,
    generate_upload_id, generate_daily_summary_id,
    generate_department_sales_id, generate_payment_method_id
)
from app.models.schemas import UploadResponse
from app.services import parse_excel, ExcelParseError
from app.services import validate_file_extension

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("/", response_model=UploadResponse)
async def upload_excel(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    # 1. Validate file type
    if not validate_file_extension(file.filename):
        raise HTTPException(400, "Only .xlsx or .xls files are accepted")

    # 2. Save file to disk
    settings = get_settings()
    os.makedirs(settings.upload_dir, exist_ok=True)
    file_path = os.path.join(settings.upload_dir, file.filename)

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # 3. Parse the Excel file (returns a list — one entry per sheet/day)
    try:
        parsed_list = parse_excel(file_path)
    except ExcelParseError as e:
        os.remove(file_path)
        raise HTTPException(422, f"Failed to parse Excel: {e}")

    last_upload = None
    for parsed in parsed_list:
        report_date = parsed["report_date"]
        
        # Check if this date already exists — skip if so
        existing = await db.execute(
            select(Upload).where(Upload.report_date == report_date)
        )
        if existing.scalar_one_or_none():
            continue  # Already have this day, skip
        
        # Insert upload, summary, departments, payments
        upload_id = generate_upload_id(report_date)
        upload = Upload(
            id=upload_id,
            filename=file.filename,
            report_date=report_date,
            status=UPLOAD_STATUS_PROCESSED,
        )
        db.add(upload)
        await db.flush()

        #6 Insert daily summary record
        daily_summary_id = generate_daily_summary_id(report_date)
        summary_data = parsed["daily_summary"]
        print("summary_data: ", summary_data)
        daily_summary = DailySummary(
            id=daily_summary_id,
            date=report_date,
            upload_id=upload_id,
            **summary_data,
        )
        db.add(daily_summary) #No db flush needed for daily summary because its id is not needed as a foreign key

        #7 Insert department sales records
        for dept in parsed["department_sales"]:
            dept_id = generate_department_sales_id(report_date, dept["department"])
            department_sales = DepartmentSales(
                id=dept_id,
                date=report_date,
                upload_id=upload_id,
                **dept,
            )
            db.add(department_sales)

        #8 Insert payment method records
        for payment_method in parsed["payment_methods"]:
            payment_method_id = generate_payment_method_id(report_date, payment_method["payment_method"])
            db.add(PaymentMethod(
            id=payment_method_id,
            date=report_date,
            upload_id=upload_id,
            **payment_method,
        ))
        last_upload = upload

    #9. Flush all inserts and return
    await db.flush()
    return last_upload










    
    

