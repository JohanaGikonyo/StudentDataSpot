import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useGlobalSearchParams } from 'expo-router'

const UserDetails = () => {
    const { id } = useGlobalSearchParams()
    return (
        <View>
            <Text>UserDetails</Text>
            <Text>User with Id {id}</Text>

        </View>
    )
}

export default UserDetails

const styles = StyleSheet.create({})