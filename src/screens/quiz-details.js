import {Text, FlatList, View, ActivityIndicator, RefreshControl} from "react-native";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {getQuizQuestionsUrl} from "../urls";

export default function QuizDetailsScreen() {
    const route = useRoute();
    const { quiz_id, title } = route.params;

    const renderItem = ({ item }) => {
        return <Text>{item.text}</Text>;
    };

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const questionUrl = getQuizQuestionsUrl(quiz_id);
    console.log(questionUrl);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const response = await axios.get(questionUrl);
            console.log(response.data);
            setData(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        async function getAllQuestions() {
            try {
                const response = await axios.get(questionUrl);
                console.log(response.data);
                setData(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        }

        getAllQuestions();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 20 }}>{title}!</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>Questions:</Text>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id.toString()} // Ensure key is a string
                        renderItem={renderItem}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                </View>
            )}
        </View>
    );
}