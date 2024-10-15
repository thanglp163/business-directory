import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Rating } from 'react-native-ratings';
import { Colors } from '../../constants/Colors';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import FlashMessage, { showMessage } from 'react-native-flash-message';

export default function Reviews({ business }) {
    const [rating, setRating] = useState(4);
    const [userInput, setUserInput] = useState('');
    const { user } = useUser();

    const onSubmit = async () => {
        if (!user || !business?.id) return;

        const docRef = doc(db, 'BusinessList', business.id);

        try {
            await updateDoc(docRef, {
                reviews: arrayUnion({
                    rating: rating,
                    comment: userInput,
                    userName: user?.fullName,
                    userImage: user?.imageUrl
                }),
            });

            showMessage({
                message: 'Comment Added Successfully!',
                type: 'success',
                icon: { icon: 'success', position: 'left' },
                backgroundColor: Colors.PRIMARY,
                color: '#fff',
                duration: 2000,
                titleStyle: { textAlign: 'center' },
                descriptionStyle: { textAlign: 'center' },
                style: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, alignSelf: 'center', width: '90%' },
            });
        } catch (error) {
            console.error('Error adding review:', error);
        }
    };

    return (
        <View style={{ padding: 20, backgroundColor: '#fff' }}>
            <Text style={{ fontFamily: 'outfit-bold', fontSize: 20 }}>Reviews</Text>
            <View>
                <Rating
                    showRating={false}
                    imageSize={20}
                    onFinishRating={(rating) => setRating(rating)}
                    style={{ paddingVertical: 10 }}
                />
                <TextInput
                    placeholder='Write your comment'
                    numberOfLines={4}
                    onChangeText={(value) => setUserInput(value)}
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 10,
                        borderColor: Colors.GRAY,
                        textAlignVertical: 'top',
                    }}
                />
                <TouchableOpacity
                    disabled={!userInput}
                    onPress={onSubmit}
                    style={{
                        padding: 10,
                        borderRadius: 6,
                        backgroundColor: Colors.PRIMARY,
                        marginTop: 10,
                    }}
                >
                    <Text
                        style={{
                            color: '#fff',
                            fontFamily: 'outfit',
                            textAlign: 'center',
                        }}
                    >
                        Submit
                    </Text>
                </TouchableOpacity>
            </View>
            <FlashMessage position="top" />
        </View>
    );
}
