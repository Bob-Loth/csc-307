def to_ymd(rdate):
    date = str(rdate)
    DMY = date.split(" ")
    DMY = DMY[0].split("-")
    day = DMY[2]
    strMonth = DMY[1]
    year = DMY[0]

    return (year + '-' + strMonth + '-' + day)
