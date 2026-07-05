# تبدیل Node.js/React به Python

## 🎯 هدف
تبدیل پروژه React + TypeScript + Node.js به Python Flask + FastAPI

## 📁 ساختار پروژه

```
aplan/
├── backend/                  # FastAPI Backend
│   ├── main.py              # Server اصلی
│   ├── models.py            # Pydantic Models
│   ├── data.py              # Data store
│   ├── requirements.txt      # Python dependencies
│   └── routes/
│       ├── products.py      # Products API
│       ├── cart.py          # Cart API
│       └── auth.py          # Auth API
│
├── frontend/                 # Flask Frontend
│   ├── app.py               # Flask server
│   ├── requirements.txt      # Python dependencies
│   ├── templates/
│   │   ├── home.html
│   │   ├── products.html
│   │   ├── product_detail.html
│   │   ├── cart.html
│   │   └── components/
│   │       ├── navbar.html
│   │       └── footer.html
│   └── static/
│       ├── css/
│       │   └── style.css
│       └── js/
│           └── main.js
│
└── README.md
```

## 🚀 نصب و اجرا

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
# Server فعال می‌شود روی: http://localhost:8000
```

### Frontend (Flask)
```bash
cd frontend
pip install -r requirements.txt
python app.py
# Frontend فعال می‌شود روی: http://localhost:5000
```

## 📝 تغییرات اصلی

- **React Components** → **Jinja2 Templates**
- **TypeScript Types** → **Pydantic Models**
- **React Router** → **Flask Routes**
- **Local Storage** → **Backend Sessions**
- **API Calls** → **FastAPI Endpoints**

## 🔧 Next Steps

1. تکمیل تمام صفحات
2. اتصال Database (SQLite/PostgreSQL)
3. تکمیل Authentication
4. صفحات checkout و orders
