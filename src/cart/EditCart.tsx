import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DangerLabel from "../system/components/DangerLabel";
import Form from "../system/components/Form";
import FormAcceptButton from "../system/components/FormAcceptButton";
import FormButton from "../system/components/FormButton";
import FormButtonBar from "../system/components/FormButtonBar";
import FormInput from "../system/components/FormInput";
import FormTitle from "../system/components/FormTitle";
import FormWarnButton from "../system/components/FormWarnButton";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import { DefaultProps } from "../system/utils/Tools";
import { addArticle, decrementArticle, deleteArticle, incrementArticle } from "./CartApi";
import CurrentCart from "./CurrentCart";

export default function EditCart(props: DefaultProps) {
    const [articleId, setArticleId] = useState("")
    const [quantity, setQuantity] = useState(0)
    const [update, forceUpdate] = useState(Date.now);
    const errorHandler = useErrorHandler()
    const navigate = useNavigate();

    const onAddArticle = async () => {
        try {
            if (!articleId || !quantity) {
                return;
            }

            await addArticle({
                articleId,
                quantity,
            });
            forceUpdate(Date.now)
        } catch (error: any) {
            errorHandler.processRestValidations(error);
        }
    }

    const onIncrement = async () => {
        try {
            if (articleId) {
                await incrementArticle(articleId);
                forceUpdate(Date.now)
            }
        } catch (error: any) {
            errorHandler.processRestValidations(error);
        }
    }

    const onDecrement = async () => {
        try {
            if (articleId) {
                await decrementArticle(articleId);
                forceUpdate(Date.now)
            }
        } catch (error: any) {
            errorHandler.processRestValidations(error);
        }
    }

    const onDelete = async () => {
        try {
            if (articleId) {
                await deleteArticle(articleId);
                forceUpdate(Date.now)
            }
        } catch (error: any) {
            errorHandler.processRestValidations(error);
        }
    }

    return (
        <div className="global_content">
            <CurrentCart forceUpdate={() => { forceUpdate(Date.now) }} />
            <br />

            <FormTitle>Artículos</FormTitle>

            <Form>
                <FormInput
                    label="Id Artículo"
                    value={articleId}
                    name="articleId"
                    onChange={e => { setArticleId(e.target.value) }}
                    errorHandler={errorHandler} />

                <FormInput
                    label="Cantidad"
                    value={quantity.toFixed(0)}
                    name="quantity"
                    onChange={e => { setQuantity(parseInt(e.target.value, 10)) }}
                    errorHandler={errorHandler} />


                <FormButtonBar>
                    <FormAcceptButton onClick={onAddArticle} label="Agregar" />
                    <FormAcceptButton onClick={onIncrement} label="Incrementar" />
                    <FormAcceptButton onClick={onDecrement} label="Decrementar" />
                    <FormWarnButton onClick={onDelete} label="Eliminar" />
                    <FormButton onClick={() => navigate("/")} label="Cancelar" />
                </FormButtonBar>

                <DangerLabel message={errorHandler.errorMessage} />
            </Form>
        </div>
    );
}
