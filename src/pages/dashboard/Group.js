import React ,{useState}from 'react'
import {Stack,Box,Typography,Link,IconButton,Divider} from "@mui/material"
import {Search,SearchIconWrapper,StyledInputBase}from './../../components/Search';
import { MagnifyingGlass,Plus } from 'phosphor-react';
import { useTheme } from '@mui/material/styles';
import  ChatElement from '../../components/ChatElement';
import { ChatList } from "../../data";
import { SimpleBarStyle } from '../../components/Scrollbar';
import CreateGroup from '../../sections/main/CreateGroup';
const Group = () => {
    const theme=useTheme();
    const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog=()=>{
    setOpenDialog(false);
  }

  return (
    <>
    
    <Stack direction={"row"} sx={{width:"100%"}}>
        {/*Left */}
       <Box sx={{height:"100vh",backgroundColor:(theme)=>theme.palette.mode==="light"?"#F8FAFF":theme.palette.background,width:320,boxShadow:"0px 0px 2px rgba(0,0,0,0.25"}}> 
    <Stack p={3} spacing={2} sx={{maxHeight:"100vh"}}>
     <Stack>
        <Typography varian="h5">
       Groups
        </Typography>
     </Stack>
     <Stack sx={{width:"100%"}}>
     <Search>
            <SearchIconWrapper>
              <MagnifyingGlass color="#709CE6" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
     </Stack>
     <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography variant="subtitle2" component={Link}>
            Create new Group
        </Typography>
        <IconButton onClick={()=>{
            setOpenDialog(true);
        }}>
            <Plus style={{color:theme.palette.primary.main}}/>
        </IconButton>
     </Stack>
     <Divider />
     <Stack
          direction="column"
          sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
        >
            
            <SimpleBarStyle timeout={500} clickOnTrack={false}>
            <Stack spacing={2.4}>
              <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                Pinned
              </Typography>
              {/*Chat List */}
              {ChatList.filter((el) => el.pinned).map((el) => {
                return <ChatElement {...el} />;
              })}
           
              <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                All Groups
              </Typography>
              {ChatList.filter((el) => !el.pinned).map((el) => {
                return <ChatElement {...el} />;
              })}
            </Stack>
          </SimpleBarStyle>



        </Stack>
    </Stack>
    </Box>
     {/*Right */}
     {/* To do=>reuse conversation component */}
    </Stack>
    {openDialog && <CreateGroup open={openDialog} handleClose={handleCloseDialog} />}
    </>
  )
}

export default Group