import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image,TextInput, ImageBackground } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as SQLite from "expo-sqlite";
import { useState } from 'react';
import { useEffect } from 'react';


import { Dropdown } from 'react-native-element-dropdown';


const homeButtonIcon = require('..//assets/homePageIcon.png');
const addPageHomeButtonIcon = require('..//assets/addPageHomeButtonIcon.png');
const addButtonIcon = require('..//assets/homePageAddButtonIcon.png');
const addPageButtonAddIcon = require('..//assets/plus.png')
const settingsButtonIcon = require('..//assets/settingsIcon.png');
const homePageSettingsIcon = require('..//assets/setting.png');
const addPlantButtonIcon = require('..//assets/addPlant.jpeg');


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
    const [plantMunites,setPlantMunites] = useState();
    const [plantHours,setPlantHours] = useState();
    const [loadingPage,setLoadingPage] = useState(true);

    const changePlantName = (input) =>{
        setPlantName(input);
        setPlantId(Number(Date.now()));
        setPlantMunites(Number(date.getMinutes()));
        setPlantHours(Number(date.getHours()));
    }

    const changePlantSize = (input) =>{
        setPlantSize(Number(input));
    }

    
    const [addPage,setAddPage] = useState(false);
   

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
            const result = await db.runAsync('DROP TABLE plant');
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

    async function UpdateWateringDay () {
        try {
            const db = await SQLite.openDatabaseAsync('myDataBase.db');
            const result = await db.runAsync('UPDATE plant SET plantWateringDay=? ',Number(plantWateringDay - 1));
            getAllDataBase();
        } 
        catch (e) {
            console.log(e);
        }
    }


    function get(){
        setLoadingPage(false);
        getAllDataBase();
    }

    if(date.getHours() == 22 && date.getMinutes() == 47 ){
        

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

    
     

    if(addPage){

        return(
            <View style={styles.container2}>
                 <Text style={styles.titleText2}>Yeni Bitki Ekle</Text>
                <View style={styles.addView}>
                    <TextInput style={styles.plankNameTextInpStyle} onChangeText={changePlantName} placeholder='Bitkinize İsim Veriniz'/>
                    <Dropdown style={styles.plantTypeStyle}
                        data={plantTypeDropDown}
                        search
                        labelField="label"
                        valueField="value"
                        placeholder="Bitki Türünü Seçiniz"
                        onChange={item =>{setPlantType(item.value)}}
                        />
                    <Dropdown style={styles.plantWateringDayStyle}
                        data={plantWateringDropDown}
                        labelField="label"
                        valueField="value"
                        placeholder="Sulama Günü"
                        onChange={item =>{setPlantWateringDay(item.value)}}
                    />
                    <TextInput style={styles.plankSizeTextInpStyle}  onChangeText={changePlantSize} placeholder='Bitkinizin Boyunu Giriniz' keyboardType='numeric'/>
                    <TouchableOpacity onPress={InsertDataBase}  style={styles.addPlankButtonStyle}>
                        <Image source={addPlantButtonIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomBar2}>
                    <TouchableOpacity  onPress={() => setAddPage(false)} style={styles.homePageButtonStyle}>
                        <Image source={homeButtonIcon} style={styles.homePageIconStyle}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButtonStyle}>
                        <Image source={addPageButtonAddIcon} style={styles.addButtonIconStyle}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingsButtonStyle}>
                        <Image source={homePageSettingsIcon} style={styles.settingsButtonIconStyle}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
   
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Bitkilerin</Text>
            <View>
                <ScrollView style={styles.plantSView}>
                    {plant.map((item,index) => (
                        <View style={styles.plantTextView} key={index}>
                            <Text>{item.plantName}</Text>
                            <Text>{item.plantType}</Text>
                            <Text>{item.plantWateringDay}</Text>
                            <Text>{item.plantSize}</Text>                        
                            <TouchableOpacity style={styles.waterButton}>
                                <Text>Sulandı</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => DeleteFromDb(item.plantId)} style={styles.waterButton}>
                                <Text>Sil</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <View style={styles.bottomBar}>
                <TouchableOpacity  style={styles.homePageButtonStyle}>
                    <Image source={addPageHomeButtonIcon}  style={styles.homePageIconStyle}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setAddPage(true)} style={styles.addButtonStyle} >
                    <Image source={addButtonIcon} style={styles.addButtonIconStyle}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsButtonStyle}>
                    <Image source={homePageSettingsIcon}  style={styles.settingsButtonIconStyle}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container2:{
        flex:1, 
        backgroundColor:'#9EF934',
    },
    container:{
        backgroundColor:'#C9DABF',
        flex:1,
    },
    titleText:{
        fontSize:25,
        top:'9%',
        left:'37%',
        color:'#0F0E0E',
    },
    titleText2:{
        fontSize:25,
        top:'10%',
        left:'30%',
        color:'#0F0E0E',
    },
    bottomBar:{
        width:'98%',
        height:'6%',
        top:'14.8%',
        left:'1%',
        borderRadius:20,
        backgroundColor:'white',
        borderWidth:1,
        borderColor:'grey'
    },
    bottomBar2:{
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
    homePageIconStyle:{
        width:40,
        height:40,
    },
    addButtonStyle:{
        bottom:'77%',
        left:'44.5%',

    },
    addButtonIconStyle:{
        width:40,
        height:40,
    },
    settingsButtonStyle:{
        bottom:'167%',
        left:'74%',
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
    settingsButtonStyle:{
        bottom:'167%',
        left:'74%',
    },
    settingsButtonIconStyle:{
        width:40,
        height:42,
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
    imageBack:{
        width:320,
        height:100,
        top:'',
        left:'10%'
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
        width:'18%',
        alignItems:'center',
        backgroundColor:'lightblue',
        
    }

});

export default HomePage;