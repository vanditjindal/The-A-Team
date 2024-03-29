import { StyleSheet, Text, View, ScrollView,  Image, TouchableWithoutFeedback, Pressable, Touchable, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SearchBar, ListItem, Avatar } from "@rneui/themed";
import { Divider } from "@react-native-material/core";
import React, { useState, useContext } from "react";
import InformationModal from '../../components/Information';
import SettingsModal from '../../components/SettingsPop';
// for theming page: react useContext and below
import themeContext from '../../config/themeContext';
import Feather from 'react-native-vector-icons/Feather'; // Icon from https://github.com/oblador/react-native-vector-icons


function HomeScreen({route, navigation}){
  // theme
  const theme = useContext(themeContext);

 //array to hold json lego db
  const legos = require('../../assets/database.json')
  //search term that is typed in the search bar
  const [searchTerm, setSearchTerm] = useState("")

  // New state for search history
  const [searchHistory, setSearchHistory] = useState([]);

  //updates searching if letters are typed in the search bar
  const updateSearch = (searchTerm) => {
    setSearchTerm(searchTerm)

    // Updated search function
    const updateSearch = (searchTerm) => {
      setSearchTerm(searchTerm);

      // Update search history
      if (searchTerm.trim().length > 0) {
        const updatedHistory = [searchTerm, ...searchHistory.slice(0, 5)];
        setSearchHistory(updatedHistory);
      }
    }
  };
    // Handle history item click
    const handleHistoryItemClick = (historyItem) => {
      setSearchTerm(historyItem);
      //navigation.navigate('Lego', { item: /* pass any relevant data based on the historyItem */ });
    };

  //function that searches and filters the array based on search request
  let results = legos.filter(function(lego) {
    //if user types in spaces
    if (searchTerm.trim().length === 0){
      return legos
    }
      
    //searching based on part name
    let partName = lego.PartName.toLowerCase().indexOf(searchTerm.trim().toLowerCase()) > -1
    //searching based on partID
    let partID = lego.PartID.toLowerCase().indexOf(searchTerm.trim().toLowerCase()) > -1
    //searching based on color
    let color = lego.Colour.toLowerCase().indexOf(searchTerm.trim().toLowerCase()) > -1
    
    //return concatenated results
    return partName+partID+color;
  });

  return(
    <View style={{backgroundColor: theme.background}}>
    
    
    {/* <Text style={{fontSize:20,position:'absolute',left:-5,bottom:-3,textAlign:'center'}}>Menu</Text> */}
    
    {/* These two modals will load the top bar which has the settings icon and the information icon which will load their respective screens. The screens are in components/... */}
    
    <InformationModal></InformationModal>
    <SettingsModal></SettingsModal>
     
      <ScrollView style={{position:'relative', marginBottom:90, backgroundColor: theme.background}}>

      <Text style={{...styles.text, left:20, marginBottom: 13, fontWeight:'bold', fontSize:25, color: theme.color}}>BrixColor Finder</Text>
      <Text style={{...styles.text, marginBottom: -5, color: theme.color}}>Please select the piece you would like to identify</Text>
      <SearchBar onChangeText={updateSearch} value={searchTerm} placeholder="Search" platform="ios" containerStyle={{position:'relative',margin:16, marginBottom: 10, backgroundColor: theme.background}}/>
      <Divider style={{marginTop: 10,marginLeft:20,marginRight:20,}}/>
      {/* iterate over the json file and print one by one */}
      
      {results.map(item => (
          <ListItem key = {item.PartID} onPress={() => navigation.navigate('Lego',{ item:item})} containerStyle={{backgroundColor: theme.theme == "dark" ? "#000000" : theme.background}} bottomDivider>
          
          <View style={styles.partContainer}>            
          <Image
            style={[styles.image, { width: 70, height: 70, borderRadius: 5 }]} 
            source={{ uri: item.ImageURL }}
          /> 
        </View>


          <ListItem.Content>
            <ListItem.Title style={{color: theme.color}}>{item.PartName}</ListItem.Title>
            <ListItem.Subtitle style={{color: theme.color}}>{'Category: ' + item.Category}</ListItem.Subtitle>
          </ListItem.Content>
          </ListItem>
      ))}

        {/* Display search history below the SearchBar */}
        {searchHistory.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyContainer}>
              {searchHistory.map((historyItem, index) => (
                  <Pressable key={index} onPress={() => handleHistoryItemClick(historyItem)}>
                    <Text style={{ marginRight: 10, color: theme.color }}>{historyItem}</Text>
                  </Pressable>
              ))}
            </ScrollView>
        )}

      </ScrollView>
      <StatusBar style="auto" />
      </View>
    );
}

const styles = StyleSheet.create({
  text:{
    position:'relative',
    left:20, 
    marginBottom:10, 
    fontSize:15,
  },

  // New style for search history container
  historyContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 20,
  },
});

export default HomeScreen