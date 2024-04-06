import React, { useState } from 'react'
import { Avatar, Box, Divider, IconButton, Stack, Switch , Menu , MenuItem} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { Gear } from "phosphor-react";
import { Nav_Buttons, Profile_Menu } from "../../data";
import AntSwitch from "../../components/AntSwitch";
import useSettings from "../../hooks/useSettings";
import { faker } from "@faker-js/faker";
import Logo from "../../assets/Images/logo.ico";


const SideBar = () => {
    const theme = useTheme();
    const [selected, setSelected] = useState(0);
    const { onToggleMode } = useSettings();
    const [anchorEl,setAnchorEl]=React.useState(null);
    const open=Boolean(anchorEl);
    const handleClick=(event)=>{
        setAnchorEl(event.currentTarget);
    }
    const handleClose=()=>{
        setAnchorEl(null);
    }
    return (
        <Box
            p={2}
            sx={{
                backgroundColor: "theme.background.paper",
                boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
                height: "100vh",
                width: 100,
            }}
        >
            <Stack
                direction={"column"}
                alignItems={"center"}
                justifyContent="space-between"
                sx={{ height: "100%" }}
                spacing={3}
            >
                <Stack alignItems={"center"} spacing={4}>
                    <Box
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            height: 64,
                            width: 64,
                            borderRadius: 1.5,
                        }}
                    >
                        <img src={Logo} alt={"Chat App Logo"} />
                    </Box>
                    <Stack
                        sx={{ width: "max-content" }}
                        direction={"column"}
                        alignItems={"center"}
                        spacing={3}
                    >
                        {Nav_Buttons.map((el) =>
                            el.index === selected ? (
                                <Box
                                    p={1}
                                    sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        borderRadius: 1.5,
                                    }}
                                >
                                    <IconButton
                                        sx={{ width: "max-content", color: "#fff" }}
                                        key={el.index}
                                    >
                                        {el.icon}
                                    </IconButton>
                                </Box>
                            ) : (
                                <IconButton
                                    onClick={() => setSelected(el.index)}
                                    sx={{ width: "max-content", color: theme.palette.mode === "light" ? "#000" : theme.palette.text.primary }}
                                    key={el.index}
                                >
                                    {el.icon}
                                </IconButton>
                            )
                        )}
                        <Divider sx={{ width: "50px" }} />
                        {selected === 3 ? (
                            <Box
                                p={1}
                                sx={{
                                    backgroundColor: theme.palette.primary.main,
                                    borderRadius: 1.5,
                                }}
                            >
                                <IconButton sx={{ color: "#fff" }}>
                                    <Gear />
                                </IconButton>
                            </Box>
                        ) : (
                            <IconButton
                                sx={{ color: theme.palette.mode === "light" ? "#000" : theme.palette.text.primary }}
                                onClick={() => setSelected(3)}
                            >
                                <Gear />
                            </IconButton>
                        )}
                    </Stack>
                </Stack>

                <Stack spacing={4}>
                    <AntSwitch onChange={() => { onToggleMode(); }} defaultChecked />
                    <Avatar id="basic-button" 
                    aria-controls={open ? "basic-menu":undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true":undefined}
                    onClick={handleClick}
                    src={faker.image.avatar()} />
                    <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                "aria-labelledby":"basic-button",
            }}
            anchorOrigin={{
                vertical:"bottom",
                horizontal:"right",
            }}
            transformOrigin={{
                vertical:"bottom",
                horizontal:"left",
            }}
        >
            <Stack spacing={1} px={1}>
                {Profile_Menu.map((el)=>(
                    <MenuItem onClick={handleClick}>
                        <Stack sx={{width:100}} direction="row" alignItems={"center"} justifyContent="space-between">
                        <span>{el.title}</span>
                        </Stack>
                    </MenuItem>
                ))}
            </Stack>
        </Menu>
                </Stack>
            </Stack>
        </Box>
    )
}

export default SideBar