import { View, Text } from 'react-native'
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

export default _layout