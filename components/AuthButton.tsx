"use client";

import { Button, CircularProgress} from "@mui/material";

interface AuthButtonProps{
    label: string; //текст кнопки - "Войти", "Зарегистрироваться"
    onClick: ()=> void; //что делать при клике
    loading?:boolean; //показываем спиннер вместо текста
}

//AuthButton - кнопка с состоянием загрузки
//пока идет запрос - показывает спиннер и блокирует повторный клик
export default function AuthButton({label, onClick, loading}: AuthButtonProps) {
    return (
        <Button
            fullWidth
            variant="contained" //стиль MUI кнопка с фоном
            onClick={onClick}
            disabled={loading} //disabled=true - кнопку нельзя нажать
            sx={{mt:2}} //sx - способ стилизации в MUI, mt:2=margin-top:16px
        >
            {/*если loading - показываем крутящийся индикатор, иначе текст */}
            {loading ? (
                <CircularProgress size={22} color="inherit" />
            ):(
                label
            )}
        </Button>
    );
}