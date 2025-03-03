import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'


const _layout = () => {
  return (
   <Tabs>
     <Tabs.Screen
             name="ChatBot"
             options={{
                tabBarIcon: () => null,
                tabBarLabel: () => null,
               headerShown: false,
            //    headerTitle: () => (
            //     <View style={styles.headerTitleContainer}>
            //         <Text style={styles.headerTitleText}>Mr. Tutor</Text>
            //     </View>
            // ),
             }}
           />
            <Tabs.Screen
                     name="ChatBubble"
                     options={{
                       tabBarIcon: () => null,
                       tabBarLabel: () => null,
                       headerShown: false,
                     }}
                   />
           </Tabs>
  )
}
const styles = StyleSheet.create({
   
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10, // Add some space between the back button and title
    },
    headerTitleText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default _layout