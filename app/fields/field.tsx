import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Appbar, Card } from 'react-native-paper';

const Field = () => {
    const router = useRouter();
    const { title: titleParam } = useLocalSearchParams();

    const title = Array.isArray(titleParam) ? titleParam[0] : titleParam;

    // Define topics for each field
    const topics: { [key: string]: string[] } = {
        Engineering: ["Solid Mechanics", "Fluid Mechanics", "Thermodynamics", "Electrical Machines", "Engineering Design", "Engineering Mathematics"],
        "Physics and Applied Math": ["Quantum Mechanics", "Electromagnetism", "Statistical Mechanics", "Complex Analysis", "Partial Differential Equations"],
        "Computer Science": ["Data Structures", "Algorithms", "Database Systems", "Operating Systems", "Artificial Intelligence"],
        "Social Sciences": ["Psychology", "Sociology", "Economics", "Political Science", "Anthropology"],
        "Media and Art": ["Digital Photography", "Graphic Design", "Film Studies", "Creative Writing", "Music Production"]
    };

    const handleTopicPress = (topic: string) => {
        router.push({
            pathname: '/fields/tutors',
            params: { topic }
        });
    };

    const renderTopic = ({ item }: { item: string }) => (
        <TouchableOpacity onPress={() => handleTopicPress(item)}>
            <Card style={styles.card}>
                <Card.Content>
                    {/* <Image source={bookimage} style={styles.bookImage} /> */}
                    <Text style={styles.topicCaption}>{item}</Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={`Hello User - ${title}`} />
            </Appbar.Header>
            <View style={styles.content}>
                <Text style={styles.fieldTitle}>{title} Topics</Text>
                <Text style={styles.fieldContent}>These are {title} Topics.</Text>
                {title && topics[title] && (
                    <FlatList
                        data={topics[title]}
                        renderItem={renderTopic}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        contentContainerStyle={styles.list}
                    />
                )}
            </View>
        </View>
    );
};

export default Field;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    fieldTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    fieldContent: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 20,
    },
    card: {
        flex: 1,
        margin: 10,
        elevation: 3, // for shadow on Android
        shadowColor: '#000', // for shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        backgroundColor: '#fff',
    },
    bookImage: {
        width: 50,
        height: 50,
        marginBottom: 10,
        alignSelf: 'center',
    },
    topicCaption: {
        fontSize: 18,
        textAlign: 'center',
    },
    row: {
        flex: 1,
        justifyContent: 'space-between',
    },
    list: {
        paddingBottom: 20,
    },
});
