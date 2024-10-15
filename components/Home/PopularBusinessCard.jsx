import { View, Text, Image } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'

export default function PopularBusinessCard({business}) {
    const router = useRouter();
  return (
    <TouchableOpacity 
      onPress={() => router.push('/businessdetail/' + business?.id)}
      style={{
        marginLeft:10,
        padding:10,
        backgroundColor: '#fff',
        borderRadius:15
    }}>
      <Image source={{uri:business?.imageUrl}}
        style={{
            width: 200,
            height: 130,
            borderRadius:15
        }}
      />
      <View style={{marginTop:7, gap:5}}>
        <Text style={{
            fontSize:17,
            fontFamily: 'outfit-bold'
        }}>{business.name}</Text>
      </View>
      <View style={{marginTop:7}}>
        <Text style={{
            fontSize:13,
            fontFamily: 'outfit',
            color: Colors.GRAY
        }}>{business.address}</Text>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
            <View style={{display:'flex', flexDirection:'row', gap:5}}>
                <Image source={require('./../../assets/images/star.png')}
                    style={{
                        width:15,
                        height:15
                    }}
                />
                <Text style={{fontFamily:'outfit'}}>4.5</Text>
            </View>
            <Text style={{
                fontFamily:'outfit',
                padding:3,
                color:'#fff',
                fontSize:12,
                backgroundColor:Colors.PRIMARY,
                borderRadius: 5
            }}>{business.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}