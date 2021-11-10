import './App.css';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Dialog, DialogActions, DialogContent, IconButton, TextField} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import {useState} from "react";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Draggable from 'react-draggable';

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
        bottom: '0.2rem',
        zIndex:10000000
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
        right:'0',
        zIndex:10000,
        fontSize:'2rem',
        fontWeight:'bold',
        paddingLeft:'2px',
        backgroundColor:'rgba(255,255,255,0.5)'
    },
    shortenURL:{
        border:'none',
        overflow:'visible',
        fontSize:'1.3rem',
        width:'16rem',
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
        "& input":{
            fontSize:'2rem'
        }
    },
    home:{
        position:'absolute',
        zIndex:100000,
        margin:'0.5rem',
        opacity: 0.7,
        backgroundColor:'rgba(255, 255, 255, 0.5)',
        display:'none',
        "& a":{
            fontFamily:"'Alfa Slab One', cursive",
            textDecoration:'none',
            fontSize:'1rem',
            color:'black'
        }
    }
}));

function App() {
    const classes = useStyles();
    const prevURLObj = new URL(window.location);
    const prevURL = prevURLObj.searchParams.get('p');
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
        // short.short(url, (err, surl)=>{
        //     const id = Date.now();
        //     let newURLS = [...urls, {id:id, url:surl, title:null, active:true}];
        //     setURL('');
        //     changeURL(newURLS);
        // })
        const id = Date.now();
        let newURLS = [...urls, {id:id, url:url, title:null, active:true}];
        setURL('');
        changeURL(newURLS);
    }
    function changeURL(urls){
        const nextURL = new URL(window.location);
        nextURL.searchParams.set('p', JSON.stringify(urls));
        window.history.pushState(null, null, nextURL);
        setURLS(urls);
    }
    const iframes = urls.map((mapElem, index) => {
        return <div key={mapElem.id} className={classes.item} style={{display:mapElem.active ? 'block' : 'none'}}>
            <iframe src={mapElem.url} className={classes.iframe}></iframe>
            <Draggable>
                <div className={classes.control}>
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
            </Draggable>
        </div>
    })
    const gridTemplateColumns = urls.filter((e)=>e.active === true).map((e) => '1fr').join(' ');

    function activeClickHandler(e) {
        return (event) => {
            if(isMoved(event.target))
                return false;
            const selectedActive = [...urls].filter((filterE) => e.id === filterE.id)[0].active;
            const newURLS = [...urls].map((mapElem2, i) => {
                    if (event.altKey) {
                        if (e.id === mapElem2.id) {
                            mapElem2.active = true;
                        } else {
                            mapElem2.active = false;
                        }
                    } else if (event.shiftKey) {
                        mapElem2.active = true;
                    } else {
                        if (e.id === mapElem2.id) {
                            mapElem2.active = !mapElem2.active;
                        }
                    }
                    return mapElem2;
                }
            );
            changeURL(newURLS);
        };
    }

    const startMoveTraker = (target)=>{
        var position = target.getBoundingClientRect();
        target.dataset.x = position.x;
        target.dataset.y = position.y;
    }
    const isMoved = (target)=>{
        let position = target.getBoundingClientRect();
        let prePosition = target.dataset;
        if(position.x !== Number(prePosition.x) || position.y !== Number(prePosition.y)){
            return true;
        }
        return false;
    }
    const activeBtn = urls.map((e,i)=><input type="button" value={i} style={{opacity:e.active ? 0.7 : 0.1}} onMouseDown={(event)=>{
        startMoveTraker(event.target);
    }} onClick={activeClickHandler(e)}  />);
    return (
        <div className={classes.root}>
            <Draggable>
                <div className={classes.home}>
                    <a href="/">Iframe Union</a>
                </div>
            </Draggable>
            <Draggable>
                <div className={classes.activeBtnGp} title="Alt+클릭:다른창 숨기기, Shift+클릭:모든창 보이기">
                    {activeBtn}
                    <input type="button" value="+" style={{opacity:0.7}}
                           onMouseDown={(event)=>{
                                startMoveTraker(event.target);
                           }}
                           onClick={(event) => {
                               if(isMoved(event.target))
                                   return false;
                               setOpen(true);
                           }}></input>
                </div>
            </Draggable>
            <div className={classes.container} style={{gridTemplateColumns: gridTemplateColumns}}>
                {iframes}
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    표시 할 웹페이지의 주소를 입력해주세요.
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
