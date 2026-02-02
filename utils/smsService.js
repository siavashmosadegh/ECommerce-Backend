import axios from "axios";

export const sendOtpForLogin = async (mobile, otp) => {
    try {
        const API_KEY = "1IC5R2XsGEAXjcqPVXJ8SMHLGyfDUYcizfmYsnjEFa2j9xBr";
        const PATTERN_CODE = 780121;
    
        const response = await axios.post(
            "https://api.sms.ir/v1/send/verify",
            {
                mobile: mobile,
                templateId: PATTERN_CODE,
                parameters: [{
                name: "Code",
                value: otp
                }]
            },
            {
                headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-API-KEY": API_KEY
                }
            }
        );

        if (response.data && response.data.status === 1) {
            console.log(`sms sent succesfully ...`)
            return {
                success: true,
                message: "SMS sent successfully"
            }
        } else {
            console.error("SMS service error: ", response.data);
            return {
                success: false,
                message: response.data.message || "Unknown Error from SMS service"
            }
        }
    } catch (error) {
        console.error("Failed to send SMS: ", error.message);
        return {
            success: false,
            message: error
        }
    }
}

export const sendOtpForRegister = async (mobile, otpCode) => {
    try {
        const API_KEY = "1IC5R2XsGEAXjcqPVXJ8SMHLGyfDUYcizfmYsnjEFa2j9xBr";
        const PATTERN_CODE = 433560;
    
        const response = await axios.post(
            "https://api.sms.ir/v1/send/verify",
            {
                mobile: mobile,
                templateId: PATTERN_CODE,
                parameters: [{
                name: "Code",
                value: otpCode
                }]
            },
            {
                headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-API-KEY": API_KEY
                }
            }
        );

        if (response.data && response.data.status === 1) {
            console.log(`sms sent succesfully ...`)
            return {
                success: true,
                message: "SMS sent successfully"
            }
        } else {
            console.error("SMS service error: ", response.data);
            return {
                success: false,
                message: response.data.message || "Unknown Error from SMS service"
            }
        }
    } catch (error) {
        console.error("Failed to send SMS: ", error.message);
        return {
            success: false,
            message: error
        }
    }
}