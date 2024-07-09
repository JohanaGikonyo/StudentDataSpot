import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
export default function TabLayout() {
    const router = useRouter();
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="youtube-play" color={color} />,
                    headerLeft: () => (
                        <View style={styles.headerLeft}>
                            <FontAwesome size={28} name="youtube-play" color="black" />
                        </View>
                    ),
                    headerRight: () => (
                        <View style={styles.headerRight}>
                            <TouchableOpacity onPress={() => { router.push('/profile/user') }}>
                                <FontAwesome size={28} name="user-circle" color="black" />
                                <Text> My Profile </Text>
                            </TouchableOpacity>
                        </View>
                    )

                }}


            />
            < Tabs.Screen
                name="settings"
                options={{
                    title: 'Chatbase',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="wechat" color={color} />,


                }}
            />
            < Tabs.Screen
                name="list"
                options={{
                    title: 'Upload',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
                }}
            />
            < Tabs.Screen
                name="tutorbook"
                options={{
                    title: 'Tutor Book',
                    tabBarIcon: ({ color }) => <FontAwesome5 name="rocketchat" size={24} color={color} />,
                }}
            />
        </Tabs >
    );
}

const styles = StyleSheet.create({
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
    },
    headerRight: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingRight: 15,
        gap: 4,
        fontFamily: "",
        fontWeight: 900,
        flexWrap: 'wrap',
    },
    headerTitle: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'blue',
    },
});
