import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material'
import React, { useState } from 'react'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MuiFileInput } from 'mui-file-input'
import Image from 'mui-image'

import { Stack, TextField } from '@mui/material'
import { date_to_ts } from '../../firebase/Fechas/Fechas';
import { uploadFile } from '../../firebase/firebase';
import { insertarPublicidad } from '../../firebase/Publicidad/PUB_CRUD';
import { Toaster, toast } from "react-hot-toast"

export default function Agregar({ obtenerDatos }) {
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState('')
    const [previewUrl, setPreviewUrl] = useState(null)

    const initialDatosPB = {
        NOMBRE: '',
        DESCRIPCION: '',
        TIEMPO: '',
        FECHA_TERMINACION: '',
        ID_ESTADOS: '',
        URL: ''
    }

    const [datosPB, setDatosPB] = useState(initialDatosPB)

    const handleChange = (newFile) => {
        setFile(newFile)
        setPreviewUrl(URL.createObjectURL(newFile))
    }

    const handleDataP = (event) => {
        setDatosPB({ ...datosPB, [event.target.name]: event.target.value })
    }

    const handleDate = (newValue) =>{
        datosPB["FECHA_TERMINACION"] = date_to_ts(newValue)
    }

    const ins_Pub = async () =>{
        const url = await uploadFile(file)
        datosPB['URL'] = url ;
        await insertarPublicidad(datosPB)

        setDatosPB(initialDatosPB)
        setFile('')
        setPreviewUrl(null)

        toast.success('Publicidad guardada')

    }

    return (
        <div>
            <Button style={{ backgroundColor: "#0048FF", color: "white" }} onClick={() => setOpen(true)}>Agregar</Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby='dialog-title'
                aria-describedby='dialog-description'
                PaperProps={{
                    style: {
                        maxWidth: '90%',
                        maxHeight: '100%',
                    },
                }}>

                <DialogTitle id='dialog-title'>
                    Datos de publicidad

                    <Button onClick={() => {
                        setOpen(false)
                        reiniciarFormulario()
                    }}>X</Button>
                    <hr />
                </DialogTitle>

                <DialogContent>

                    <DialogContentText className='mt-2' id='dialog-description'>
                        <div className=' row'>
                            <div className='col-6 d-flex align-items-center'>
                                <Stack spacing={3}>
                                    <Stack spacing={2}>
                                        <TextField label="Nombre" name='NOMBRE' onChange={(e) => handleDataP(e)} />
                                    </Stack>
                                    <Stack spacing={2}>
                                        <TextField label="Descripcion" name='DESCRIPCION' multiline rows={6} onChange={(e) => handleDataP(e)} />
                                    </Stack>
                                    <Stack direction="row" spacing={2}>
                                        <TextField label="Tiempo (seg)" name='TIEMPO' onChange={(e) => handleDataP(e)} />

                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker label="Fecha de terminacion" onChange={(newValue) => handleDate(newValue)} />
                                        </LocalizationProvider>

                                    </Stack>

                                </Stack>

                            </div>
                            <div className='col-6'>
                                <Image src={previewUrl} width={500} height={500} duration={0} fit={"contain"} />
                                <MuiFileInput value={file} onChange={handleChange} />
                            </div>

                        </div>


                    </DialogContentText>
                </DialogContent>

                <DialogActions className='align-middle'>
                    <Button className='bg-success text-white' onClick={async () => {
                        setOpen(false)
                        await ins_Pub()
                        //await insertar(valoresSeleccionados)
                        obtenerDatos()
                        // reiniciarFormulario()
                    }} >Guardar</Button>

                </DialogActions>
            </Dialog>
            <Toaster
                position="top-right"
                reverseOrder={true}
            />
        </div>
    )
}