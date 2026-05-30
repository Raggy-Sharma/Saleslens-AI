import datetime
from openpyxl import load_workbook
from pathlib import Path

class ExcelParseError(Exception):
    """Raised when the Excel file doesn't match the expected format."""
    pass

def safe_float(value) -> float:
    """Convert a cell value to float, defaulting to 0.0 for None or errors."""
    if value is None:
        return 0.0
    if isinstance(value, str):
        if value.startswith("#"):  # Excel errors like #DIV/0!
            return 0.0
        try:
            return float(value)
        except ValueError:
            return 0.0
    return float(value)

def safe_int(value) -> int:
    return int(safe_float(value))

def parse_date_from_sheet_name(sheet_name: str) -> datetime.date:
    try:
        return datetime.datetime.strptime(sheet_name.strip(), "%d-%m-%Y").date()
    except ValueError:
        raise ExcelParseError(
            f"Sheet name '{sheet_name}' is not in expected DD-MM-YYYY format"
        )

def find_row_by_label(ws, label: str, search_range: range = range(1, 30)) -> int | None:
    """Scan column A for a label and return the row number."""
    for row in search_range:
        cell_value = ws.cell(row=row, column=1).value
        if cell_value and label.lower() in str(cell_value).lower().strip():
            return row
    return None

def validate_structure(ws) -> None:
    checks = {
        "A5": "Deparment",
    }
    for cell, expected in checks.items():
        actual = ws[cell].value
        if actual is None or expected.lower() not in str(actual).lower():
            raise ExcelParseError(
                f"Validation failed: expected '{expected}' in cell {cell}, "
                f"got '{actual}'. Is this the correct Excel format?"
            )

    for label in ["Net Sales", "Gross Sales"]:
        if not find_row_by_label(ws, label):
            raise ExcelParseError(f"Could not find '{label}' in column A")

def parse_department_sales(ws) -> list[dict]:
    departments = [
        (6,  "food_sales"),
        (7,  "nab_sale"),
        (8,  "party_sale"),
        (9,  "general"),
        (10, "barista"),
        (11, "party_nab"),
        (12, "party_food"),
    ]

    results = []
    for row, dept_key in departments:
        results.append({
            "department": dept_key,
            "lunch_sales": safe_float(ws.cell(row=row, column=2).value),
            "hi_tea_sales": safe_float(ws.cell(row=row, column=3).value),
            "dinner_sales": safe_float(ws.cell(row=row, column=4).value),
            "day_total": safe_float(ws.cell(row=row, column=5).value),
        })
    return results

def parse_daily_summary(ws) -> dict:
    net_row = find_row_by_label(ws, "Net Sales")
    gross_row = find_row_by_label(ws, "Gross Sales")
    discount_row = find_row_by_label(ws, "Discount")
    gst_row = find_row_by_label(ws, "Gst")
    sc_row = find_row_by_label(ws, "Service Charge")
    ro_row = find_row_by_label(ws, "Round Off")
    ff_row = find_row_by_label(ws, "Foot Fall")
    txn_row = find_row_by_label(ws, "Transactions")

    if not net_row or not gross_row:
        raise ExcelParseError("Could not find Net Sales or Gross Sales row")

    def sum_bcd(row):
        return safe_float(ws.cell(row, 2).value) + safe_float(ws.cell(row, 3).value) + safe_float(ws.cell(row, 4).value)

    def col_e(row):
        return safe_float(ws.cell(row, 5).value)

    return {
        "net_sales": sum_bcd(net_row),
        "gross_sales": sum_bcd(gross_row),
        "discount": sum_bcd(discount_row) if discount_row else 0,
        "gst": col_e(gst_row) if gst_row else 0,
        "service_charge": col_e(sc_row) if sc_row else 0,
        "round_off": col_e(ro_row) if ro_row else 0,
        "foot_fall": safe_int(col_e(ff_row)) if ff_row else 0,
        "transactions": safe_int(col_e(txn_row)) if txn_row else 0,
    }

def parse_payment_methods(ws) -> list[dict]:
    methods = [
        (27, "cash"),
        (28, "explorex"),
        (29, "card"),
        (30, "upi"),
        (31, "others"),
        (32, "eazydiner"),
    ]
    results = []
    for row, method_key in methods:
        results.append({
            "payment_method": method_key,
            "digital_sales": safe_float(ws.cell(row=row, column=2).value),
            "actual": safe_float(ws.cell(row=row, column=3).value),
            "variance": safe_float(ws.cell(row=row, column=4).value),
        })
    return results

def validate_file_extension(file_path: str | Path) -> None:
    file_path = Path(file_path)
    if not file_path.suffix.lower() in (".xlsx", ".xls"):
        return False
    return True
        
    

def parse_excel(file_path: str | Path) -> list[dict]:
    file_path = Path(file_path)

    if not file_path.exists():
        raise ExcelParseError(f"File not found: {file_path}")

    if not file_path.suffix.lower() in (".xlsx", ".xls"):
        raise ExcelParseError(f"Expected .xlsx or .xls file, got: {file_path.suffix}")

    try:
        wb = load_workbook(file_path, data_only=True, read_only=True)
    except Exception as e:
        raise ExcelParseError(f"Failed to open Excel file: {e}")

    if len(wb.sheetnames) == 0:
        raise ExcelParseError("Excel file has no sheets")

    results = []
    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        report_date = parse_date_from_sheet_name(sheet_name)
        validate_structure(ws)

        results.append({
            "report_date": report_date,
            "daily_summary": parse_daily_summary(ws),
            "department_sales": parse_department_sales(ws),
            "payment_methods": parse_payment_methods(ws),
        })

    wb.close()
    return results