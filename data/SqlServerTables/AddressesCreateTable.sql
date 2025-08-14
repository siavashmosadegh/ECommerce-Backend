use mydatabase;

CREATE TABLE [dbo].[Addresses] (
  AddressID     INT IDENTITY(1,1) PRIMARY KEY,

  -- مالک آدرس: یا کاربر ثبت‌نامی یا مهمان (یکی از این دو باید مقدار داشته باشد)
  UserID        INT NULL,
  GuestID       INT NULL,

  -- فیلدهای آدرس
  Label         NVARCHAR(50) NULL,         -- مثلا: "خانه"، "محل کار"
  Line1         NVARCHAR(255) NOT NULL,    -- آدرس اصلی (خیابان، پلاک)
  Line2         NVARCHAR(255) NULL,        -- آدرس تکمیلی (واحد، طبقه)
  City          NVARCHAR(120) NOT NULL,
  Province      NVARCHAR(120) NULL,
  PostalCode    NVARCHAR(20)  NULL,
  CountryCode   NCHAR(2)      NOT NULL DEFAULT 'IR', -- کد کشور ISO-3166-1 alpha-2

  -- اختیاری: برای لجستیک/نقشه
  Latitude      DECIMAL(9,6)  NULL,
  Longitude     DECIMAL(9,6)  NULL,

  -- وضعیت‌ها
  IsDefault     BIT           NOT NULL DEFAULT 0,    -- آدرس پیش‌فرض مالک
  IsDeleted     BIT           NOT NULL DEFAULT 0,    -- Soft Delete

  -- زمان‌ها (UTC برای سازگاری)
  CreatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
  UpdatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),

  -- محاسبات کمکی برای ایندکس یکتای "یک دیفالت برای هر مالک"
  OwnerType AS (CASE WHEN UserID IS NOT NULL THEN N'U' ELSE N'G' END) PERSISTED,
  OwnerRef  AS (COALESCE(UserID, GuestID)) PERSISTED,

  -- تضمین اینکه دقیقا یکی از UserID/GuestID پر باشد (XOR)
  CONSTRAINT CK_Addresses_Owner
    CHECK (
      (UserID IS NULL AND GuestID IS NOT NULL) OR
      (UserID IS NOT NULL AND GuestID IS NULL)
    ),

  -- اگر جداول Users/GuestUsers در اسکیمای دیگری هستند، نام کامل‌شان را جایگزین کنید
  CONSTRAINT FK_Addresses_User
    FOREIGN KEY (UserID)  REFERENCES [dbo].[Users](UserID),
  CONSTRAINT FK_Addresses_Guest
    FOREIGN KEY (GuestID) REFERENCES [dbo].[GuestUsers](GuestID)
);

-- ایندکس‌های پرکاربرد برای لیست‌گیری سریع
CREATE INDEX IX_Addresses_User_Active
  ON [dbo].[Addresses](UserID)
  WHERE UserID IS NOT NULL AND IsDeleted = 0;

CREATE INDEX IX_Addresses_Guest_Active
  ON [dbo].[Addresses](GuestID)
  WHERE GuestID IS NOT NULL AND IsDeleted = 0;

-- تضمین «حداکثر یک آدرس دیفالت» برای هر مالک (کاربر یا مهمان)
-- با استفاده از ستون‌های محاسباتی OwnerType/OwnerRef و ایندکس یکتای فیلترشده
CREATE UNIQUE INDEX UIX_Addresses_SingleDefault
  ON [dbo].[Addresses](OwnerType, OwnerRef)
  WHERE IsDeleted = 0 AND IsDefault = 1;
