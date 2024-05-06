import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";


function SurveyToast(props) {
  const onSubmit = () => {
    props.onClose("showSurveyModal");
  };

  return (
    <Toast onClose={props.onClose} show={props.show} delay={15000} autohide >
      <div className="toast-header">
        <div>Help us improve PassHub</div>
        <div>
          <svg
            style={{ width: 24, height: 24, cursor: "pointer" }}
            onClick={props.onClose}
          >
            <use href="#f-cross24"></use>
          </svg>
        </div>
      </div>

      <Toast.Body>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            margin: "16px 0 0 0",
          }}
        >
          <Button variant="primary" type="button" onClick={onSubmit}>
            Take&nbsp;short&nbsp;survey
          </Button>
          <Button variant="outline-secondary" onClick={props.onClose}>
            Remind&nbsp;me&nbsp;later
          </Button>
        </div>
      </Toast.Body>
    </Toast>
  );
}

export default SurveyToast;
