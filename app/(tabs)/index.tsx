import React, { useState } from 'react';
import { View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface DefaultTabProps {
    // Define props if needed
}

const DefaultTab: React.FC<DefaultTabProps> = () => {
    const router = useRouter();
    const [search, setSearch] = useState<string>('');

    const handleSearchChange = (text: string) => {
        setSearch(text);
    };

    return (
        <View style={styles.container}>
            <View style={styles.search}>
                <FontAwesome size={24} name="cog" color='black' />
                <SearchBar
                    placeholder="Search Here..."
                    platform="default"
                    containerStyle={styles.searchBarContainer}
                    inputContainerStyle={styles.searchInputContainer}
                    inputStyle={styles.searchInput}
                    value={search}
                    onChangeText={handleSearchChange}
                    showLoading={false}
                />
                <FontAwesome size={24} name="microphone" color='black' />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f5f5f5', // Optional: background color
    },
    search: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2, // for shadow on Android
        shadowColor: '#000', // for shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    searchBarContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        paddingHorizontal: 10,
    },
    searchInputContainer: {
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        height: 40,
    },
    searchInput: {
        fontSize: 16,
    },
});

export default DefaultTab;
