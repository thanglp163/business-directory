import { View, Text, FlatList, Image, TouchableOpacity, Linking, Share, Alert } from 'react-native';
import React from 'react';
import * as WebBrowser from 'expo-web-browser';

export default function ActionButton({ business }) {

    const actionButtonMenu = [
        {
            id: 1,
            name: 'Call',
            icon: require('./../../assets/images/call.png'),
            url: 'tel:' + business?.contact
        },
        {
            id: 2,
            name: 'Location',
            icon: require('./../../assets/images/pin.png'),
            url: 'https://www.google.com/maps/search/?api=1&query=' + business?.address
        },
        {
            id: 3,
            name: 'Web',
            icon: require('./../../assets/images/web.png'),
            url: business?.website
        },
        {
            id: 4,
            name: 'Share',
            icon: require('./../../assets/images/share.png'),
            url: business?.website
        }
    ];

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Check out this business: ${business?.website}`
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const OnPressHandle = async (item) => {
        if (item.name === 'Share') {
            onShare();
        } else if (item.name === 'Web') {
            // Open the website using expo-web-browser
            await WebBrowser.openBrowserAsync(item.url);
        } else {
            // For other items, use Linking
            Linking.openURL(item.url);
        }
    };

    return (
        <View style={{ padding: 20, backgroundColor: '#fff' }}>
            <FlatList
                data={actionButtonMenu}
                horizontal={true}
                contentContainerStyle={{ width: '100%', justifyContent: 'space-between' }}
                renderItem={({ item, index }) => (
                    <TouchableOpacity key={index} onPress={() => OnPressHandle(item)}>
                        <Image source={item?.icon} style={{ width: 50, height: 50 }} />
                        <Text style={{
                            fontFamily: 'outfit-medium',
                            textAlign: 'center',
                            marginTop: 3
                        }}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}