import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DangerLabel from "../system/components/DangerLabel";
import Form from "../system/components/Form";
import FormButton from "../system/components/FormButton";
import FormButtonBar from "../system/components/FormButtonBar";
import FormTitle from "../system/components/FormTitle";
import ImageButton from "../system/components/ImageButton";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import * as questionsApi from "./QuestionsApi";
import * as catalogApi from "../catalog/CatalogApi";

export default function MyQuestions() {
  const navigate = useNavigate();
  const errorHandler = useErrorHandler();

  const [items, setItems] = useState<questionsApi.IQuestion[]>([]);
  const [articlesById, setArticlesById] = useState<Record<string, catalogApi.IArticle>>({});

  const reload = async () => {
    try {
      const qs = await questionsApi.getMine();
      setItems(qs);
      // Enriquecer con nombres de artículos
      const uniqueArticleIds = Array.from(new Set(qs.map((q) => q.articleId)));
      if (uniqueArticleIds.length > 0) {
        try {
          const results = await Promise.all(
            uniqueArticleIds.map((id) =>
              catalogApi.getArticle(id).catch(() => undefined as any)
            )
          );
          const map: Record<string, catalogApi.IArticle> = {};
          results.forEach((art) => {
            if (art && art._id) map[art._id] = art;
          });
          setArticlesById(map);
        } catch (_) {
        }
      }
    } catch (err: any) {
      errorHandler.processRestValidations(err);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const onDelete = async (id: string) => {
    try {
      await questionsApi.remove(id);
      await reload();
    } catch (err: any) {
      errorHandler.processRestValidations(err);
    }
  };

  return (
    <div className="global_content">
      <FormTitle>Mis preguntas</FormTitle>
      <Form>
        <DangerLabel message={errorHandler.errorMessage} />
        <FormButtonBar>
          <FormButton label="Volver" onClick={() => navigate(-1)} />
        </FormButtonBar>
      </Form>
      <div>
        <br />
        <table className="table">
          <thead>
            <tr>
              <th>Artículo</th>
              <th>Pregunta</th>
              <th>Respuesta</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((q) => (
              <tr key={q._id}>
                <td>
                  <div><strong>{articlesById[q.articleId]?.name || q.articleId}</strong></div>
                  <div style={{ color: "#666", fontSize: "0.85em" }}>{q.articleId}</div>
                  <div>
                    <a href={`#/articleQuestions/${q.articleId}`}>ver preguntas</a>
                  </div>
                </td>
                <td>{q.question}</td>
                <td>{q.answer || <i>Sin respuesta</i>}</td>
                <td>
                  <ImageButton title="Eliminar pregunta" imageUrl="/assets/delete.png" className={{width: 20}} onClick={() => onDelete(q._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
