import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import DangerLabel from "../system/components/DangerLabel";
import FormAcceptButton from "../system/components/FormAcceptButton";
import FormButton from "../system/components/FormButton";
import FormButtonBar from "../system/components/FormButtonBar";
import FormLabel from "../system/components/FormLabel";
import FormTitle from "../system/components/FormTitle";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import { DefaultProps } from "../system/utils/Tools";
import { checkout, getCurrentCart, ICart, ICartValidation, validate } from "./CartApi";

interface CurrentCartProps extends DefaultProps {
    forceUpdate?: () => any
}

export default function CurrentCart(props: CurrentCartProps) {
    const [currentCart, setCurrentCart] = useState<ICart>()
    const [validation, setValidation] = useState<ICartValidation | undefined>()

    const errorHandler = useErrorHandler()
    const navigate = useNavigate();

    const loadCurrentCart = async () => {
        try {
            const result = await getCurrentCart();
            setCurrentCart(result);

        } catch (error: any) {
            errorHandler.processRestValidations(error);
        }
    }

    const refresh = () => {
        loadCurrentCart();
    }

    const onValidate = async () => {
        try {
            const result = await validate();
            setValidation(result);
        } catch (error: any) {
            errorHandler.processRestValidations(error);
        }
    }

    const onCheckout = async () => {
        try {
            await checkout();
            loadCurrentCart();
        } catch (error: any) {
            errorHandler.processRestValidations(error);
        }
    }

    useEffect(() => {
        loadCurrentCart()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.forceUpdate])

    return (
        <div className="global_content">
            <FormTitle>Carrito Actual</FormTitle>

            <CurrentCartDetails
                navigate={navigate}
                cart={currentCart}
                onValidate={onValidate}
                onCheckout={onCheckout}
                onRefresh={refresh}
            />

            <br />

            <FormLabel label="Validación" text={JSON.stringify(validation)} />

            <DangerLabel message={errorHandler.errorMessage} />
        </div>
    );

}


interface CurrentCartDetailsProps extends DefaultProps {
    navigate: NavigateFunction,
    cart?: ICart,
    onValidate: () => any,
    onCheckout: () => any,
    onRefresh: () => any
}

function CurrentCartDetails(props: CurrentCartDetailsProps) {
    if (!props.cart) {
        return null
    }

    return (
        <div className="global_content">
            <div>
                <FormLabel label="Id Carrito" text={props.cart._id} />
                <FormLabel label="Id Usuario" text={props.cart.userId} />

                <table id="articles" className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Cantidad</th>
                            <th>Valid</th>
                            <th>Validado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.cart.articles?.map((article, i) => {
                            return (
                                <tr key={i}>
                                    <td>{article.articleId}</td>
                                    <td>{article.quantity}</td>
                                    <td>{article.valid ? "Si" : "No"}</td>
                                    <td>{article.validated ? "Si" : "No"}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <FormButtonBar>
                    <FormAcceptButton label="Validar" onClick={props.onValidate} />
                    <FormAcceptButton label="Checkout" onClick={props.onCheckout} />
                    <FormAcceptButton label="Refresh" onClick={props.onRefresh} />
                    <FormButton label="Cancelar" onClick={() => props.navigate("/")} />
                </FormButtonBar>
            </div>
        </div>
    );
}
