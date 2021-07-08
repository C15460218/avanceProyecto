import React from 'react'
import { useEffect } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';
import { Alert, Button, SafeAreaView, Text, View } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import style from '../assets/style'

const db = SQLite.openDatabase({name:'mydata'}, ()=>console.log('CONNECTED ITEM'))

const ItemScreen = function({ route, navigation }) {
    const id_suscripcion = route.params.id_suscripcion;
    const [nombre, setNombre] = useState('')
    const [monto, setMonto] = useState('')

    const setStates = function(nombre, monto) {
        setNombre(nombre)
        setMonto(monto)
    }

    function onModificarPress() {
        navigation.navigate('modificarScreen', {id_suscripcion})
    }

    function onEliminarPress() {
        Alert.alert('¿Desea elminar?',
            '¿Está seguro que desea elminar el registro?\nEsta acción no se puede deshacer',
            [
                {
                    text: "Sí",
                    onPress: (v) => {
                        db.transaction(tx => {
                            tx.executeSql(
                                'DELETE FROM suscripciones WHERE id_suscripcion = ?',
                                [id_suscripcion],
                                (tx, res) => {
                                    if (res.rowsAffected === 0) {
                                        Alert.alert('Fallo al eliminar', 'No se eliminó el registro')
                                        return;
                                    }

                                    navigation.goBack()
                                },
                                error => console.log(error)
                            )
                        })
                    }
                },
                {
                    text: 'No'
                }
            ])
    }

    useEffect(function(){
        navigation.addListener('focus', function() {
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM suscripciones WHERE id_suscripcion = ?",
                [id_suscripcion],
                function(tx2, res) {
                    if (res.rows.length === 0) {
                        alert("No se encontró la suscripcion");
                        return;
                    }
                    let row = res.rows.item(0)
                    setStates(row.nombre, row.monto)
                },
                error => console.log({error}))
            })
        })
    }, [navigation]);

    return (
        <SafeAreaView>
            <View style={style.dataBox}>
                <Text style={style.dataLabel}>Nombre</Text>
                <Text style={style.dataContent}>{nombre}</Text>
                <Text style={style.dataLabel}>Monto</Text>
                <Text style={style.dataContent}>{monto}</Text>
            </View>
            <View>
                <Button title="Modificar" onPress={onModificarPress} />
                <Button title="Eliminar" onPress={onEliminarPress} />
            </View>
        </SafeAreaView>
    );
}

export default ItemScreen;