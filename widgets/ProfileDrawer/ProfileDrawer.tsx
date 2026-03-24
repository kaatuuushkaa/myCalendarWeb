"use client";

import { useState } from "react";
import {
    Drawer, Box, Typography, Divider,
    IconButton, Tab, Tabs, CircularProgress, Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useProfile } from "@/hooks/useProfile";
import ProfileTab from "./ProfileTab";
import ResetPasswordTab from "./ResetPasswordTab";

interface ProfileDrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function ProfileDrawer({ open, onClose }: ProfileDrawerProps) {
    const [tab, setTab] = useState(0);
    const { profile, loading, error, handleUpdate, handleResetPassword } = useProfile(open);

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: 380 } }}
        >
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                        Мой профиль
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                    <Tab label="Профиль" />
                    <Tab label="Пароль" />
                </Tabs>

                {loading && <CircularProgress />}
                {error && <Alert severity="error">{error}</Alert>}

                {!loading && tab === 0 && profile && (
                    <ProfileTab profile={profile} onUpdate={handleUpdate} />
                )}

                {!loading && tab === 1 && (
                    <ResetPasswordTab onReset={handleResetPassword} />
                )}
            </Box>
        </Drawer>
    );
}