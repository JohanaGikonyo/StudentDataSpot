import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const List = () => {
    return (
        <View>
            <Text>
                <Link href='list/1'>List 1</Link>
                <Link href='list/2'>List 2</Link>
                <Link href='list/3'>List 3</Link>
                <Link href='list/4'>List 4</Link>

            </Text>
        </View >
    )
}

export default List

const styles = StyleSheet.create({})