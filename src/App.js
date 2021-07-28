import './App.css';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Dialog, DialogActions, DialogContent, IconButton, TextField} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import {useState} from "react";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

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
    item: {
        border:'1px solid black',
        position:'relative'
    },
    iframe: {
        width: '100%',
        height: '100vh'
    },
    addBtn: {
        position: 'absolute',
        right: '0.2rem',
        bottom: '0.2rem'
    },
    cover:{
        width:'100%',
        height:'100%',
        backgroundColor:'gray',
        border:'5px solid black'
    },
    control:{
        position:"absolute",
        bottom:'0',
        left:'0',
        zIndex:10000,
        fontSize:'2rem',
        fontWeight:'bold',
        paddingLeft:'2px',
        backgroundColor:'rgba(255,255,255,0.5)'
    },
    shortenURL:{
        border:'none',
        overflow:'visible',
        fontSize:'1rem',
        width:'12rem',
        verticalAlign:'middle',
        backgroundColor:'rgba(255,255,255,0)'
    },
    deleteBtn:{
        padding:'0',
        verticalAlign:'middle'
    },
    activeBtnGp:{
        position:'absolute',
        top:'1px',
        right:'1px',
        zIndex:1000000,
        fontSize:'2rem',
        "& input":{
            display:'block'
        }
    }
}));

function App() {
    const classes = useStyles();
    const prevURLObj = new URL(window.location);
    const prevURL = prevURLObj.searchParams.get('p');
    const prevMaxID = prevURLObj.searchParams.get('i');
    var maxId = prevMaxID === null ? 0 : prevMaxID;
    var parsedURL = JSON.parse(prevURL);
    parsedURL = parsedURL === null ? [] : parsedURL;
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
            const id = Date.now();
            let newURLS = [...urls, {id:Number(maxId), url:surl, title:null, active:true}];
            maxId++;
            setURL('');
            changeURL(newURLS, maxId);
        })
    }
    const handleMake = () => {
        window.open(pingURL);
    }
    function changeURL(urls, maxId){
        const nextURL = new URL(window.location);
        nextURL.searchParams.set('p', JSON.stringify(urls));
        nextURL.searchParams.set('i', maxId);
        window.history.pushState(null, null, nextURL);
        setURLS(urls);
    }
    const iframes = urls.map((mapElem, index) => {
        console.log('display:mapElem.active', mapElem.active);

        return <div key={mapElem.id} className={classes.item} style={{display:mapElem.active ? 'block' : 'none'}}>
            <iframe src={mapElem.url} className={classes.iframe}></iframe>
            <div className={classes.control}
            >
                <IconButton aria-label="delete" className={classes.deleteBtn} onClick={function () {
                    const newURLS = [...urls].filter((filterElem, i) => mapElem.id !== filterElem.id);
                    changeURL(newURLS);
                }}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="visibility" className={classes.deleteBtn} onClick={function () {
                    const newURLS = [...urls].map((mapElem2, i) => {
                            if (mapElem.id === mapElem2.id) {
                                mapElem2.active = false;
                                return mapElem2;
                            }
                            return mapElem2;
                        }
                    );
                    changeURL(newURLS);
                }}>
                    <VisibilityOffIcon fontSize="small" />
                </IconButton>
                <input className={classes.shortenURL} id="shortenName" type="text" value={urls[index].url} onClick={(e)=>{e.target.select();}}></input>
            </div>
        </div>
    })
    const gridTemplateColumns = urls.filter((e)=>e.active === true).map((e) => '1fr').join(' ');
    const activeBtn = urls.filter((e)=>e.active === false).map((e,i)=><input type="button" value={e.id} onClick={()=>{
        const newURLS = [...urls].map((mapElem2, i) => {
                if (e.id === mapElem2.id) {
                    mapElem2.active = true;
                    return mapElem2;
                }
                return mapElem2;
            }
        );
        changeURL(newURLS);
    }}  />);
    return (
        <div className={classes.root}>
            <div className={classes.activeBtnGp}>
                {activeBtn}
            </div>
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
                    추가 할 웹페이지의 주소를 입력해주세요.
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
                        value={url}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAdd} color="primary">
                        웹페이지 추가
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        취소
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default App;
