import './App.css';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Dialog, DialogActions, DialogContent, TextField} from "@material-ui/core";
import {useState} from "react";
//import {short} from "node-url-shortener";
const short = require("node-url-shortener");

const pingURL = 'https://docs.google.com/spreadsheets/d/1MsDJxO9xOHl8LE02n34n51hxwTA_usDn-Yta4Y84LeU/copy';
const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh'
    },
    container: {
        display: 'grid',
        height:'100%'
    },
    item: {},
    iframe: {
        width: '100%',
        height: '100vh'
    },
    addBtn: {
        position: 'absolute',
        right: '1rem',
        bottom: '1rem'
    },
    cover:{
        width:'100%',
        height:'100%',
        backgroundColor:'gray',
        border:'5px solid black'
    }
}));

function App() {
    const classes = useStyles();

    const prevURLObj = new URL(window.location);
    const prevURL = prevURLObj.searchParams.get('p');
    var parsedURL = JSON.parse(prevURL);
    parsedURL = parsedURL === null ? [] : parsedURL;
    parsedURL = parsedURL.map((e)=>{
        e.active = false;
        return e;
    })
    const [open, setOpen] = useState(false);
    const [url, setURL] = useState(null);
    const [urls, setURLS] = useState(
        parsedURL === null ? [] : parsedURL
    );
    const handleClose = () => {
        setOpen(false);
    };
    const handleAdd = () => {
        handleClose();
        short.short(url, (err, surl)=>{
            setURLS([...urls, {url:surl, title:null, active:true}]);
            const nextURL = new URL(window.location);
            nextURL.searchParams.set('p', JSON.stringify([...urls, {url:surl, title:null, active:false}]));
            window.history.pushState(null, null, nextURL);
        })
    }
    const handleMake = () => {
        window.open(pingURL);
    }
    const iframes = urls.map((e, index) => {
        return <div key={index} className={classes.item}>
            {
                e.active ?
                    <iframe src={e.url} className={classes.iframe}></iframe> :
                    <div className={classes.cover} onClick={()=>{
                        const _urls = [...urls];
                        const newURLS = _urls.map((e2, index2)=>{
                            if(index === index2){
                                return {...e2, ...{active:true}};
                            } else {
                                return e2;
                            }
                        });
                        setURLS(newURLS);
                    }}></div>
            }
        </div>
    })
    const gridTemplateColumns = urls.map((e) => '1fr').join(' ');
    console.log('iframes', iframes, 'classes.container', classes.container);
    return (
        <div className={classes.root}>
            <div className={classes.container} style={{gridTemplateColumns: gridTemplateColumns}}>
                {iframes}
            </div>
            <Fab color="primary" aria-label="add" className={classes.addBtn}>
                <AddIcon onClick={() => {
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
                        value={"https://docs.google.com/spreadsheets/d/1MsDJxO9xOHl8LE02n34n51hxwTA_usDn-Yta4Y84LeU/edit#gid=0"}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        취소
                    </Button>
                    <Button onClick={handleAdd} color="primary">
                        핑추가
                    </Button>
                    <Button onClick={handleMake} color="primary">
                        핑복사
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default App;
