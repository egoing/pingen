import './App.css';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Dialog, DialogActions, DialogContent, TextField} from "@material-ui/core";
import {useState} from "react";
import Split from 'react-split'


const pingURL = 'https://docs.google.com/spreadsheets/d/1MsDJxO9xOHl8LE02n34n51hxwTA_usDn-Yta4Y84LeU/copy';
const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh'
    },
    container: {
        display: 'grid'

    },
    item: {
        border: '1px solid magenta',
    },
    iframe: {
        width: '100%',
        height: '100vh'
    },
    addBtn: {
        position: 'absolute',
        right: '1rem',
        bottom: '1rem'
    },
}));

function App() {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [url, setURL] = useState(null);
    const [urls, setURLS] = useState(
        ['https://docs.google.com/spreadsheets/d/1vpi_A1zS1B4CICcBP53hoO1eGnr9JLBQmL4rmOn4Uw8/edit','https://docs.google.com/spreadsheets/d/1vpi_A1zS1B4CICcBP53hoO1eGnr9JLBQmL4rmOn4Uw8/edit']
    );

    const handleClose = () => {
        setOpen(false);
    };
    const handleAdd = () => {
        setURLS([...urls, url]);
        handleClose();
    }


    const iframes = urls.map((e, index) => {
        return <div className={classes.item}>
            <iframe src={e} className={classes.iframe}></iframe>
        </div>
    })
    const gridTemplateColumns = urls.map((e) => '1fr').join(' ');
    console.log('iframes', iframes, 'classes.container', classes.container);
    return (
        <div className={classes.root}>
            <Split className="split">
                {iframes}
            </Split>
            <Fab color="primary" aria-label="add" className={classes.addBtn}>
                <AddIcon onClick={() => {
                    console.log('click');
                    window.open(pingURL);
                    setOpen(true);
                }}/>
            </Fab>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    복제한 ping 시트의 주소를 입력해주세요.
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="URL"
                        type="url"
                        fullWidth
                        onChange={(e) => {
                            setURL(e.target.value);
                            console.log(e.target.value)
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default App;
