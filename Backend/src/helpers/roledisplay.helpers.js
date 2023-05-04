const roleDisplay = (role)=>{
    switch (role) {
        case "hoc-sinh":
            return "Học sinh";
        case "giao-vien":
            return "Giáo viên"
        case "to-chuc-giao-duc":
            return "Tổ chức giáo dục"
        case "phu-huynh":
            return "Phụ huynh"
        default:
            return undefined;
    }
}

module.exports = {roleDisplay}