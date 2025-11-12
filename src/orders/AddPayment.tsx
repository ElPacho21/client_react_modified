import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import DangerLabel from "../system/components/DangerLabel";
import ErrorLabel from "../system/components/ErrorLabel";
import Form from "../system/components/Form";
import FormAcceptButton from "../system/components/FormAcceptButton";
import FormButton from "../system/components/FormButton";
import FormButtonBar from "../system/components/FormButtonBar";
import FormInput from "../system/components/FormInput";
import FormTitle from "../system/components/FormTitle";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import { DefaultProps } from "../system/utils/Tools";
import { addPayment, IPayment } from "./OrdersApi";

interface AddPaymentProps extends DefaultProps {
    orderId: string;
    payment: IPayment;
    onPaymentAdded: () => (void);
}

export default function AddPayment(props: AddPaymentProps) {
    const [amount, setAmount] = useState(props.payment.amount)
    const [method, setMethod] = useState(props.payment.method)

    const errorHandler = useErrorHandler()
    const navigate = useNavigate();

    const addPaymentClick = async () => {
        errorHandler.cleanRestValidations();

        try {
            await addPayment(props.orderId, method, amount);
            props.onPaymentAdded();
        } catch (error: any) {
            errorHandler.processRestValidations(error);
        }
    }

    return (
        <div className="global_content">
            <FormTitle>Agregar Articulo</FormTitle>

            <Form>
                <div className="form-group">
                    <label>Method</label>

                    <select id="method"
                        value={method}
                        onChange={e => setMethod(e.target.value)}
                        className={errorHandler.getErrorClass("method", "form-control")}>
                        <option value="CASH">CASH</option>
                        <option value="CREDIT">CREDIT</option>
                        <option value="DEBIT">DEBIT</option>
                    </select>
                    <ErrorLabel message={errorHandler.getErrorText("method")} />
                </div>

                <FormInput
                    label="Importe"
                    name="amount"
                    onChange={e => setAmount(parseFloat(e.target.value))}
                    errorHandler={errorHandler} />

                <DangerLabel message={errorHandler.errorMessage} />

                <FormButtonBar>
                    <FormAcceptButton label="Agregar" onClick={addPaymentClick} />
                    <FormButton label="Cancelar" onClick={() => navigate("/")} />
                </FormButtonBar>
            </Form>
        </div >
    );
}
