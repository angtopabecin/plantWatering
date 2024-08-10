import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, TextInput, Pressable} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import react from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as SQLite from "expo-sqlite";
import { useState } from 'react';
import { useEffect } from 'react';
import CheckBox from 'react-native-check-box';

import { Dropdown } from 'react-native-element-dropdown';
import { isEnabled } from 'react-native/Libraries/Performance/Systrace';


const homePageHomeButtonIcon = require('..//assets/homePageHomeButtonIcon.png');
const homeButtonIcon = require('..//assets/homeButtonIcon.png');
const addButtonIcon = require('..//assets/homePageAddButtonIcon.png');
const addPageButtonAddIcon = require('..//assets/plus.png')
const settingsPageSettingsButtonIcon = require('..//assets/settingsPageSettingsIcon.png');
const settingsIcon = require('../assets/settingsButtonIcon.png');
const addPlantButtonIcon = require('..//assets/addPlant.jpeg');
const deleteButtonIcon = require('..//assets/deleteButton.png');
const languageFlagIconTurkey = require('..//assets/turkey.png');
const languageFlagIconEngland = require('..//assets/united-kingdom.png');

const Stack = createNativeStackNavigator();

const plantTypeDropDown = [
    {label: 'Menekşe', value:'Menekşe'},
    {label: 'Lale', value:'Lale'},
    {label: 'Gül', value:'Gül'},
    {label: 'Kardelen', value:'Kardelen'},
    {label: 'Orkide', value:'Orkide'},
    {label: 'Papatya', value:'Papatya'},
    {label: 'Sümbül', value:'Sümbül'},
    {label: 'Yasemin', value:'Yasemin'},
];

const plantWateringDropDown = [
    {label:'1',value:1},
    {label: '2', value:2},
    {label: '3', value:3},
    {label: '4', value:4},
    {label: '5', value:5},
    {label: '6', value:6},
    {label: '7', value:7},
    {label: '8', value:8},
    {label: '10', value:10},
    {label: '11', value:11},
    {label: '12', value:12},
    {label: '13', value:13},
    {label: '14', value:14},
    {label: '15', value:15},
];

let date = new Date();


function HomePage({navigation}) {


    const [plant,setPlant] = useState([]);
    const [plantId,setPlantId] = useState();
    const [plantName,setPlantName] = useState();
    const [plantType,setPlantType] = useState(null);
    const [plantWateringDay,setPlantWateringDay] = useState(null);
    const [plantSize,setPlantSize] = useState();
    const [loadingPage,setLoadingPage] = useState(true);
    const [settingsPage, setSettingsPage] = useState(false);
    const [updateBool,setUpdateBool] = useState();
    const [isSelected,setSelection] = useState(updateBool);
    const [loadingPage2,setLoadingPage2] = useState(true);


    const changePlantName = (input) =>{
        setPlantName(input);
        setPlantId(Number(Date.now()));
    }

    const changePlantSize = (input) =>{
        setPlantSize(Number(input));
    }

    
    const [addPage,setAddPage] = useState(false);
   
    //burası bitkiler için veritabanı

    async function CreateDataBase () {
        try {
            const db = await SQLite.openDatabaseSync('myDataBase.db');
            await db.execAsync('CREATE TABLE IF NOT EXISTS plant(plantId INTEGER PRIMARY KEY NOT NULL,plantName TEXT NOT NULL,plantType TEXT NOT NULL,plantWateringDay INTEGER NOT NULL,plantSize INTEGER NOT NULL);');

        } 
        catch (e) {
            console.log(e);    
        }
    }


    async function InsertDataBase() {
        CreateDataBase()
        try {
            const db = await SQLite.openDatabaseSync('myDataBase.db')
            const result = await db.runAsync('INSERT INTO plant(plantId,plantName,plantType,plantWateringDay,plantSize) VALUES (?,?,?,?,?)',Number(plantId),plantName,plantType,Number(plantWateringDay),Number(plantSize))
            getAllDataBase();

        } 
        catch (e) {
            console.log(e)
        }
    }
    

    async function getAllDataBase () {
        try {
            const db = await SQLite.openDatabaseAsync('myDataBase.db');
            const result = await db.getAllAsync('SELECT * FROM plant');
            setPlant(result);
            console.log(plant);
        } 
        catch (e) {
            console.log(e);
        }
    }

    async function dropD () {
        try {
            const db = await SQLite.openDatabaseAsync('myDataBase.db');
            const result = await db.runAsync('DROP TABLE language');
        } 
        catch (e) {
            console.log(e);
        }
    }

    async function DeleteFromDb (plantId) {
        try {
            const db = await SQLite.openDatabaseAsync('myDataBase.db');
            const result = await db.runAsync('DELETE FROM plant WHERE plantId=?',Number(plantId));
            getAllDataBase();
        } 
        catch (e) {
            console.log(e);
        }
    }

    async function UpdateWateringDay (a) {
        try {
            const db = await SQLite.openDatabaseAsync('myDataBase.db');
            const result = await db.runAsync('UPDATE plant SET plantWateringDay=? ',Number(plantWateringDay - a));
            getAllDataBase();
        } 
        catch (e) {
            console.log(e);
        }
    }

    //Burası Dil için Veritabanı

    async function CreateDataBaseLang() {
        try {
            const db = await SQLite.openDatabaseSync('myDataBase.db');
            await db.execAsync('CREATE TABLE IF NOT EXISTS language(isSelected TEXT NOT NULL)');
            InsertDataBaseLang();
        } 
        catch (e) {
            console.log(e);    
        }
    }

    async function InsertDataBaseLang() {
        try {
            const db = await SQLite.openDatabaseSync('myDataBase.db');
            const result = await db.runAsync(`INSERT INTO language (isSelected) SELECT 'true' WHERE NOT EXISTS (SELECT 1 FROM language)`,);
            getAllDataBaseLang()
        } 
        catch (e) {
            console.log(e)
        }
    }
    
    async function UpdateLang() {
        try {
            const db = await SQLite.openDatabaseAsync('myDataBase.db');
            const result = await db.runAsync('UPDATE language SET isSelected=?',isSelected); 
            getAllDataBaseLang()     
        } 
        catch (e) {
            console.log(e);
        }
    }

    async function getAllDataBaseLang () {
        try {
            const db = await SQLite.openDatabaseAsync('myDataBase.db');
            const result = await db.getFirstAsync('SELECT * FROM language');
            setUpdateBool(result.isSelected);
            console.log(updateBool);
        } 
        catch (e) {
            console.log(e);
        }
    }


    var titleText1;
    var titleText2;
    var titleText3;
    var buttonText;
    var settingsLanguageText;
    var plantNamePlaceHolder;
    var plantTypePlaceHolder;
    var plantDayPlaceHolder;
    var plantSizePlaceHolder;

    if(updateBool == 0){
        titleText1 = 'Bitkilerin';
        titleText2 = 'Yeni Bitki Ekle';
        titleText3 = 'Ayarlar';
        buttonText = 'Sulandı';
        settingsLanguageText = 'Dil Seçiniz';
        plantNamePlaceHolder = 'Bitkinize İsim Veriniz';
        plantTypePlaceHolder = 'Bitki Türünü Seçiniz';
        plantDayPlaceHolder = 'Sulama Günü',
        plantSizePlaceHolder = 'Bitki Boyunu Giriniz';
    }

    if(updateBool  == 1){
        titleText1 = 'Your Plants';
        titleText2 = 'Add New Plant';
        titleText3 = 'Settings';
        buttonText = 'Watered';
        settingsLanguageText = ' Language';
        plantNamePlaceHolder = 'Enter Plant Name ';
        plantTypePlaceHolder = 'Choose Plant Type';
        plantDayPlaceHolder = 'Watering Day',
        plantSizePlaceHolder = 'Enter Plant Size';
    }
    
    function get(){
        setLoadingPage(false);
        getAllDataBase();
    }

    function pageLoading(){
        setAddPage(false);
        setSettingsPage(false);
    }

    function pageLoadingAddPage(){
        setSettingsPage(false);
        setAddPage(true);
    }
    function get2(){
        setLoadingPage2(false);
        getAllDataBaseLang();
    }


    function b () {
        console.log(date.getMinutes())

    }

    function selectedChange(){
        setSelection(!isSelected);
        console.log(isSelected);
        CreateDataBaseLang();
        InsertDataBaseLang();
        UpdateLang();
    }

    if(loadingPage == true){
        get()
        return(
            <View style={styles.loadingTextView}>
                <Text style={styles.loadingText}>
                    Loading....
                </Text>
            </View>
        )    
    }
    
    if(loadingPage2 == true){
        get2()
        return(
            <View style={styles.loadingTextView}>
                <Text style={styles.loadingText}>
                    Loading....
                </Text>
            </View>
        )    
    }

  
    if(settingsPage){
        
        return(
            <View style={styles.settingsContainer}>
                <Text style={{fontSize:30,fontStyle:'italic',top:'9%',left:'38.5%',color:'white'}}>{titleText3}</Text>
                <Text style={{fontSize:18, left:'39%', top:'11.5%',color:'white'}}>
                    {settingsLanguageText}
                </Text>
                <CheckBox
                    style={styles.languageButtonStyle}
                    isChecked={isSelected}
                    onClick={selectedChange}
                    checkedImage={<Image style={styles.languageCheckedBoxStyle} source={languageFlagIconTurkey}/>}
                    unCheckedImage={<Image style={styles.languageCheckedBoxStyle} source={languageFlagIconEngland}/>}
                />
                <View style={styles.settingsPageBottomBar}>
                    <TouchableOpacity  onPress={pageLoading} style={styles.homePageButtonStyle}>
                        <Image source={homeButtonIcon} style={styles.homePageIconStyle}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pageLoadingAddPage} style={styles.addButtonStyle}>
                        <Image source={addButtonIcon} style={styles.addButtonIconStyle}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingsButtonStyle}>
                        <Image source={settingsPageSettingsButtonIcon} style={styles.settingsButtonIconStyle}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    if(addPage){
        
        return(
            <View style={styles.addPageContainer}>
                <Text style={styles.addPageTitleText}>{titleText2}</Text>
                <View style={styles.addView}>
                    <TextInput style={styles.plankNameTextInpStyle} onChangeText={changePlantName} placeholder={plantNamePlaceHolder}/>
                    <Dropdown style={styles.plantTypeStyle}
                        data={plantTypeDropDown}
                        search
                        labelField="label"
                        valueField="value"
                        placeholder={plantTypePlaceHolder}
                        onChange={item =>{setPlantType(item.value)}}
                    />
                    <Dropdown style={styles.plantWateringDayStyle}
                        data={plantWateringDropDown}
                        labelField="label"
                        valueField="value"
                        placeholder={plantDayPlaceHolder}
                        onChange={item =>{setPlantWateringDay(item.value)}}
                    />
                    <TextInput style={styles.plankSizeTextInpStyle}  onChangeText={changePlantSize} placeholder={plantSizePlaceHolder} keyboardType='numeric'/>
                    <TouchableOpacity onPress={InsertDataBase}  style={styles.addPlankButtonStyle}>
                        <Image source={addPlantButtonIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.addPageBottomBar}>
                    <TouchableOpacity  onPress={() => setAddPage(false)} style={styles.homePageButtonStyle}>
                        <Image source={homeButtonIcon} style={styles.homePageIconStyle}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButtonStyle}>
                        <Image source={addPageButtonAddIcon} style={styles.addButtonIconStyle}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSettingsPage(true)} style={styles.settingsButtonStyle}>
                        <Image source={settingsIcon} style={styles.settingsButtonIconStyle}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.HomePageContainer}>
            <Text style={styles.homePageTitleText}>{titleText1}</Text>
            <View>
                <ScrollView style={styles.plantSView}>
                    {plant.map((item,index) => (
                        <View style={styles.plantTextView} key={index}>
                            <Text>{item.plantName}</Text>
                            <Text>{item.plantType}</Text>
                            <Text>{item.plantWateringDay}</Text>
                            <Text>{item.plantSize}</Text>                        
                            <TouchableOpacity onPress={b} style={styles.waterButton}>
                                <Text>
                                    {buttonText}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => DeleteFromDb(item.plantId)} style={styles.deleteButtonStyle}>
                                <Image style={styles.deleteButtonIconStyle} source={deleteButtonIcon}/>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <View style={styles.homePageBottomBar}>
                <TouchableOpacity  style={styles.homePageHomeButtonStyle}>
                    <Image source={homePageHomeButtonIcon}  style={styles.homePageIconStyle}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setAddPage(true)} style={styles.homePageAddButtonIconStyle} >
                    <Image source={addButtonIcon} style={styles.addButtonIconStyle}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSettingsPage(true)} style={styles.homePageSettingsButtonIconStyle}>
                    <Image source={settingsIcon} style={styles.settingsButtonIconStyle}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    settingsContainer:{
        flex:1,
        backgroundColor:'#A2A784'
    },
    addPageContainer:{
        flex:1, 
        backgroundColor:'#9EF934',
    },
    HomePageContainer:{
        backgroundColor:'#C9DABF',
        flex:1,
    },
    homePageTitleText:{
        fontSize:25,
        top:'9%',
        left:'37%',
        color:'#0F0E0E',
        fontStyle:'italic',
    },
    addPageTitleText:{
        fontSize:25,
        top:'10%',
        left:'30%',
        color:'#0F0E0E',
        fontStyle:'italic',
    },
    homePageBottomBar:{
        width:'98%',
        height:'6%',
        top:'14.8%',
        left:'1%',
        borderRadius:20,
        backgroundColor:'white',
        borderWidth:1,
        borderColor:'grey'
    },
    settingsPageBottomBar:{
        borderRadius:20,
        backgroundColor:'white',
        borderWidth:1,
        borderColor:'grey',
        width:'98%',
        top:'78.95%',
        left:'1%',
        height:'6%'
    },
    languageButtonStyle:{
        borderWidth:1,
        width:'98%',
        height:'7%',
        left:'1%',
        top:'12.5%',
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#DEDCC6'
        
    },
    languageCheckedBoxStyle:{
        width:50,
        height:50,
    },
    homePageHomeButtonStyle:{
        top:'8%',
        left:'15%'
    },
    homePageAddButtonIconStyle:{
        bottom:'77%',
        left:'44.5%',
    },
    homePageSettingsButtonIconStyle:{
        bottom:'163%',
        left:'74%',
    },
    addPageBottomBar:{
        width:'98%',
        height:'6%',
        top:'49.8%',
        left:'1%',
        borderRadius:20,
        backgroundColor:'white',
        borderWidth:1,
        borderColor:'grey'
    },
    homePageButtonStyle:{
        top:'8%',
        left:'15%'
    },
    addButtonStyle:{
        bottom:'77%',
        left:'44.5%',
    },
    settingsButtonStyle:{
        bottom:'163%',
        left:'74%',
    },
    homePageIconStyle:{
        width:40,
        height:40,
    },
    addButtonIconStyle:{
        width:40,
        height:40,
    },
    settingsButtonIconStyle:{
        width:40,
        height:42,
    },
    plantViewStyle:{
        borderWidth:1,
        width:'50%',
        height:'50%',
        top:'50%'
    },
    addPlankButtonStyle:{
        width:100,
        height:32,
        borderWidth:1,
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        top:'40%',
        left:'37%'
    },
    addView:{
        width:'98%',
        height:'40%',
        borderWidth:1,
        left:'1%',
        borderRadius:20,
        top:'20%',
        backgroundColor:'white', 
    },
    plankNameTextInpStyle:{
        left:'26.5%',
        top:'14%',
        width:180,
        height:35,
        borderWidth:1,
        borderRadius:20,
        textAlign:'center',
    },
    plantTypeStyle:{
        height: 35,
        borderWidth:1,
        borderRadius:15,
        width:180,
        left:'26.5%',
        top:'20%',
        textAlign:'center',
    },
    plantWateringDayStyle:{
        height: 35,
        borderWidth:1,
        borderRadius:15,
        width:180,
        left:'26.5%',
        top:'26%',
        textAlign:'center',
    },
    plankSizeTextInpStyle:{
        left:'26.5%',
        top:'32%',
        width:180,
        height:35,
        borderWidth:1,
        borderRadius:20,

    },
    plantTextView:{
        borderWidth:1,
        borderRadius:20,
        marginTop:'1%',
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center'
    },
    plantSView:{
        width:'98%',
        left:'1%',  
        top:'15%',
        height:'75%'
    },
    loadingText:{
        fontSize:35,

    },
    loadingTextView:{
        alignItems:'center',
        flex:1,
        justifyContent:'center',
        backgroundColor:'lightblue',

    },
    waterButton:{
        borderWidth:1,
        borderRadius:10,
        alignItems:'center',
        width:'18%',
        backgroundColor:'lightblue',
    },
    deleteButtonStyle:{
        borderWidth:1,
        borderRadius:15,
        width:25,
        height:25,
        justifyContent:'center',
        alignItems:'center'
    },
    deleteButtonIconStyle:{
        width:13,
        height:13,
    },
    
});

export default HomePage;