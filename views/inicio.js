import React, { useState } from 'react'
import { useEffect } from 'react';
import { Button, FlatList, SafeAreaView, TouchableOpacity, Text } from 'react-native'
import SQLite from 'react-native-sqlite-storage'
import style from '../assets/style'

// import CustomButton from '../controls/custombutton'

const db = SQLite.openDatabase({name:'mydata'});


const InicioScreen = function({ navigation }) {

    const [suscripciones, setSuscripciones] = useState([]);

    useEffect(function() {
        db.transaction(function(t) {
            // t.executeSql('DROP TABLE IF EXISTS contactos',[],
            //     () => console.log('DROPED TABLE contactos'),
            //     error => console.log({error})
            // );
            t.executeSql(
                'CREATE TABLE IF NOT EXISTS suscripciones (' +
                'id_suscripcion    INTEGER         PRIMARY KEY     AUTOINCREMENT,' +
                'nombre         VARCHAR(128)    NOT NULL,' +
                'monto       VARCHAR(20)     NOT NULL' +
                ');',
                [],
                () => console.log('CREATED TABLE suscripcion'),
                error => console.log({error})
            );
        })
    }, []);

    useEffect(function() {
        navigation.addListener('focus', function() {
            db.transaction(function(t) {
                t.executeSql("SELECT * FROM suscripciones",[], function(tx, res) {
                    let data = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        data.push(res.rows.item(i));
                    }
                    setSuscripciones(data);
                }, (error) => { console.log({ error }) });
            });
        })
    }, [navigation]);

    const suscripcionItem = function({ item }) {
        const onPress = function() {
            // console.log({item});
            navigation.navigate('itemScreen', {id_suscripcion:item.id_suscripcion})
        }
        return (
            <TouchableOpacity onPress={onPress} style={style.itemContacto}>
                <Text style={style.itemContactoTitle}>{item.nombre}</Text>
                <Text style={style.itemContactoDetails}>{item.monto}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <SafeAreaView>
            <Button style={style.button} title="Agregar" onPress={()=>navigation.navigate('agregarScreen')} />
            <FlatList
                data={suscripciones}
                renderItem={suscripcionItem}
                keyExtractor={i=>i.id_suscripcion}
            />
        </SafeAreaView>
    )
}

export default InicioScreen;