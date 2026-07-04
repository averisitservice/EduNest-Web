import { useTheme } from "@emotion/react";
import { Divider, IconButton, Stack, SwipeableDrawer, Typography } from "@mui/material";
import { Iconify } from "../iconify";



export default function LsBottomSheet({ children, isOpen, onClose, size, title = "", taskTitle = "", icon = "" }) {
  const theme = useTheme()
  return (
    <SwipeableDrawer
      slotProps={{
        paper: {
          sx: {
            borderTopLeftRadius: "6%",
            borderTopRightRadius: "6%",
            background: theme.palette.background.default,
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
            boxSizing: 'border-box',
          },
        },
      }}
      anchor='bottom' open={isOpen} onClose={onClose} onOpen={() => { }}>

      <Stack height={window.screen.height * (size / 100)}>
        {icon || title ? (
          <>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
              {icon && icon}
              <Typography color={"primary"} p={2} variant='h4'>
                {title}
              </Typography>
              <IconButton size='large' sx={{ mr: 1 }} onClick={() => onClose(false)}>
                <Iconify icon={"mingcute:close-line"} />
              </IconButton>
            </Stack>
            {taskTitle && (
              <Stack direction={"row"} px={2} mt={-2} mb={2}>
                <Typography color={theme.palette.secondary.main} variant='subtitle2'>
                  {taskTitle}
                </Typography>
              </Stack>
            )}
            <Divider />
          </>
        ) : null}

        {children}
      </Stack>
    </SwipeableDrawer>
  )
}