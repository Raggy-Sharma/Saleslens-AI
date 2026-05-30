import datetime
import uuid
from sqlalchemy import (
    Column, Integer, String, Float, Date, DateTime, ForeignKey,
    UniqueConstraint, JSON
)
from sqlalchemy.orm import relationship
from app.db.session import Base

DSR_PREFIX = "fbs-dsr"  # Fixed prefix for all upload IDs
CACHED_INSIGHT_PREFIX = f'{DSR_PREFIX}-insight'
USER_PREFIX = f"{DSR_PREFIX}-user"

def generate_upload_id(report_date: datetime.date) -> str:
    """Generate upload ID like fbs-dsr-09052026 from the report date."""
    return f"{DSR_PREFIX}-{report_date.strftime('%d%m%Y')}"

class Upload(Base):
    __tablename__ = "uploads"
    id = Column(String(30), primary_key=True)
    filename = Column(String, nullable=False)
    report_date = Column(Date, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    uploaded_by = Column(String(30), ForeignKey("users.id"), nullable=True)
    status = Column(String(20), default="processed")

    daily_summary = relationship("DailySummary", back_populates="upload")
    department_sales = relationship("DepartmentSales", back_populates="upload")
    payment_methods = relationship("PaymentMethod", back_populates="upload")
    cached_insights = relationship("CachedInsight", back_populates="upload", uselist=False)

def generate_daily_summary_id(report_date: datetime.date) -> str:
    """Generate daily summary ID like fbs-dsr-09052026-1234567890 from the report date and upload ID."""
    return f"{DSR_PREFIX}-{report_date.strftime('%a').lower()}-{report_date.strftime('%d%m%Y')}"

class DailySummary(Base):
    __tablename__ = "daily_summaries"
    id = Column(String(30), primary_key=True)
    date = Column(Date, nullable=False)
    net_sales = Column(Float, nullable=False, default=0)
    gross_sales = Column(Float, nullable=False, default=0)
    discount = Column(Float, default=0)
    gst = Column(Float, default=0)
    service_charge = Column(Float, default=0)
    round_off = Column(Float, default=0)
    foot_fall = Column(Integer, default=0)
    transactions = Column(Integer, default=0)
    upload_id = Column(String(30), ForeignKey("uploads.id"), nullable=False)
    upload = relationship("Upload", back_populates="daily_summary")


def generate_department_sales_id(report_date: datetime.date, department_abbr: str) -> str:
    """Generate department sales ID like fbs-dsr-09052026-1234567890-DEPT from the report date and department abbreviation."""
    return f"{DSR_PREFIX}-{department_abbr}-{report_date.strftime('%d%m%Y')}"

class DepartmentSales(Base):
    __tablename__ = "department_sales"
    id = Column(String(30), primary_key=True)
    date = Column(Date, nullable=False)
    department = Column(String(50), nullable=False)

    lunch_sales = Column(Float, default=0)
    hi_tea_sales = Column(Float, default=0)
    dinner_sales = Column(Float, default=0)
    day_total = Column(Float, default=0)

    upload_id = Column(String(30), ForeignKey("uploads.id"), nullable=False)
    upload = relationship("Upload", back_populates="department_sales")

    __table_args__ = (
        UniqueConstraint("date", "department", name="uq_dept_date"), # Ensure unique department sales for each date. No same department sales on the same day
    )

def generate_payment_method_id(report_date: datetime.date, payment_method: str) -> str:
    """Generate payment method ID like fbs-dsr-09052026-1234567890-PAYMENT_METHOD from the report date and payment method."""
    return f"{DSR_PREFIX}-{payment_method}-{report_date.strftime('%d%m%Y')}"

class PaymentMethod(Base):
    __tablename__ = "payment_methods"
    id = Column(String(30), primary_key=True)
    date = Column(Date, nullable=False)
    payment_method = Column(String(50), nullable=False)
    digital_sales = Column(Float, default=0)
    actual = Column(Float, default=0)
    variance = Column(Float, default=0)

    upload_id = Column(String(30), ForeignKey("uploads.id"), nullable=False)
    upload = relationship("Upload", back_populates="payment_methods")

    __table_args__ = (
        UniqueConstraint("date", "payment_method", name="uq_payment_date"), # Ensure unique payment method for each day. No same payment method on the same day
    )

def generate_cached_insight_id(report_date: datetime.date) -> str:
    """Generate cached insight ID like fbs-dsr-09052026-1234567890-INSIGHT from the report date."""
    return f"{CACHED_INSIGHT_PREFIX}-{report_date.strftime('%a').lower()}-{report_date.strftime('%d%m%Y')}"

class CachedInsight(Base):
    __tablename__ = "cached_insights"
    id = Column(String(30), primary_key=True)
    date = Column(Date, nullable=False)
    insights_json = Column(JSON, nullable=False)
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)
    upload_id = Column(String(30), ForeignKey("uploads.id"), nullable=False)
    upload = relationship("Upload", back_populates="cached_insights")

def generate_user_id() -> str:
    short_id = uuid.uuid4().hex[:8]
    return f"{USER_PREFIX}-{short_id}"

class User(Base):
    __tablename__ = "users"
    id = Column(String(30), primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=False)
    invite_code = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)







