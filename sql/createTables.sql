CREATE TABLE User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL
);

CREATE TABLE SkiArea (
    SkiAreaID VARCHAR(64) PRIMARY KEY,
    Country VARCHAR(50) NOT NULL,
    Region VARCHAR(50),
    DownhillDistanceKm DECIMAL(5,2) NULL,
    VerticalM INT NULL,
    MinElevationM INT NULL,
    MaxElevationM INT NULL,
    LiftCount INT NULL,
    RunConvention VARCHAR(20),
    OpenSkiMap VARCHAR(255),
    Geometry VARCHAR(20),
    Latitude DECIMAL(9,6) NULL,
    Longitude DECIMAL(9,6) NULL,
    Sources VARCHAR(255)
);

CREATE TABLE Favorites (
    SkiAreaID VARCHAR(64) NOT NULL,
    UserID INT NOT NULL,
    PRIMARY KEY (UserID, SkiAreaID),
    FOREIGN KEY (SkiAreaID) REFERENCES SkiArea(SkiAreaID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE SkiAreaWebsite (
    WebsiteID INT AUTO_INCREMENT PRIMARY KEY,
    SkiAreaID VARCHAR(64),
    WebsiteURL VARCHAR(255),
    FOREIGN KEY (SkiAreaID) REFERENCES SkiArea(SkiAreaID)
);

CREATE TABLE SkiAreaName (
    NameID INT AUTO_INCREMENT PRIMARY KEY,
    SkiAreaID VARCHAR(64),
    Name VARCHAR(100) NOT NULL,
    FOREIGN KEY (SkiAreaID) REFERENCES SkiArea(SkiAreaID)
);

CREATE TABLE Run (
    RunID VARCHAR(64) PRIMARY KEY,
    Country VARCHAR(50) NOT NULL,
    Region VARCHAR(50),
    Difficulty VARCHAR(20),
    Color VARCHAR(10),
    Lit BOOLEAN,
    InclinedLengthM DECIMAL(6,2) NULL,
    DescentM INT NULL,
    AveragePitch DECIMAL(5,2) NULL,
    MaxPitch DECIMAL(5,2) NULL,
    MinElevationM INT NULL,
    MaxElevationM INT NULL,
    DifficultyConvention VARCHAR(20),
    OpenSkiMap VARCHAR(255),
    Geometry VARCHAR(20),
    Latitude DECIMAL(9,6) NULL,
    Longitude DECIMAL(9,6) NULL,
    Sources VARCHAR(255)
);

CREATE TABLE RunName (
    RunNameID INT AUTO_INCREMENT PRIMARY KEY,
    RunID VARCHAR(64) NOT NULL,
    Name VARCHAR(100) NOT NULL,
    FOREIGN KEY (RunID) REFERENCES Run(RunID)
);

CREATE TABLE SkiAreaRun (
    SkiAreaID VARCHAR(64) NOT NULL,
    RunID VARCHAR(64) NOT NULL,
    PRIMARY KEY (SkiAreaID, RunID),
    FOREIGN KEY (SkiAreaID) REFERENCES SkiArea(SkiAreaID),
    FOREIGN KEY (RunID) REFERENCES Run(RunID)
);