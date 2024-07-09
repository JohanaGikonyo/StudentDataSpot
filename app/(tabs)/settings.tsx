import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SettingsTab() {
    return (
        <View style={styles.container}>
            <Text>Tab Settings</Text>
            <TouchableOpacity><Text>Hello</Text></TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
