import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DangerLabel from "../system/components/DangerLabel";
import FormAcceptButton from "../system/components/FormAcceptButton";
import FormButton from "../system/components/FormButton";
import FormButtonBar from "../system/components/FormButtonBar";
import FormTitle from "../system/components/FormTitle";
import ImageButton from "../system/components/ImageButton";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import { DefaultProps } from "../system/utils/Tools";
import { IOrderList, getOrders } from "./OrdersApi";

export default function OrdersList(props: DefaultProps) {
    const [orders, setOrders] = useState(new Array<IOrderList>())

    const errorHandler = useErrorHandler()
    const navigate = useNavigate();

    const loadOrders = async () => {
        try {
            const ordersResult = await getOrders();
            setOrders(ordersResult);
        } catch (error: any) {
            errorHandler.processRestValidations(error);
        }
    }

    const refresh = () => {
        loadOrders();
    }

    const showOrder = (id?: string) => {
        if (id) {
            navigate("/showOrder/" + id);
        }
    }

    useEffect(() => {
        loadOrders()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="global_content">
            <FormTitle>Ordenes</FormTitle>

            <div hidden={!orders}>
                <table id="articles" className="table">
                    <thead>
                        <tr>
                            <th> Id </th>
                            <th> CartId </th>
                            <th> Estado </th>
                            <th> Precio Total </th>
                            <th> Pago Total </th>
                            <th> Creada </th>
                            <th> Ultima Act. </th>
                            <th> Artículos </th>
                            <th> Buscar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders ? orders.map((element, i) => {
                            return (
                                <tr key={i}>
                                    <td> {element.id} </td>
                                    <td> {element.cartId} </td>
                                    <td> {element.status} </td>
                                    <td> {element.totalPrice} </td>
                                    <td> {element.totalPayment} </td>
                                    <td> {element.created} </td>
                                    <td> {element.updated} </td>
                                    <td> {element.articles} </td>
                                    <td>
                                        <ImageButton
                                            title="Ver orden"
                                            imageUrl="/assets/edit.png"
                                            onClick={() => showOrder(element.id)}
                                        />
                                    </td>
                                </tr>
                            );
                        }) : ""
                        }
                    </tbody>
                </table>
            </div>

            <FormButtonBar>
                <FormAcceptButton label="Actualizar" onClick={refresh} />
                <FormButton label="Cancelar" onClick={() => navigate("/")} />
            </FormButtonBar>

            <DangerLabel message={errorHandler.errorMessage} />
        </div>
    );
}
