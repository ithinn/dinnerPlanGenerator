import React, { useEffect, useState } from 'react';
import { StyleSheet, Modal, Text, Pressable, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView} from 'react-native';

export default function User({route, navigation}) {

    const handleNavigate = () => {
        navigation.navigate("HomeTab")
    }


    console.log(navigation);
    return(
        <View>
            <Text>User</Text>
            <TouchableOpacity onPress={handleNavigate}>
                <Text>Gå hjem</Text>
            </TouchableOpacity>
        </View>
    )
}