"use client";

import { Box, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";

interface HeaderWidgetProps {
    onMenuClick: () => void; // открыть ProfileDrawer — это проп потому что ProfileDrawer снаружи
}

export default function HeaderWidget({ onMenuClick }: HeaderWidgetProps) {
    const router = useRouter();

    // handleLogout живёт здесь — это логика шапки
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");
        router.push("/login");
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 4,
                py: 2,
                bgcolor: "white",
                boxShadow: 1,
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={onMenuClick}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" fontWeight={700}>
                    myCalendar
                </Typography>
            </Box>

            <Button variant="outlined" color="error" onClick={handleLogout}>
                Выйти
            </Button>
        </Box>
    );
}