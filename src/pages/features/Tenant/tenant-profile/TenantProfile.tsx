import React, { useEffect, useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ToastAlert } from "../../../../components/toast-alert/toast-alert";
import {
  regexForName,
  // regexForUser,
  // regexForEmail,
} from "../../../../resources/constants";
import { RootState } from "../../../../store";

import { updateTenant } from "../../../../store/features/tenant/update-tenant/slice";
import { useAppDispatch } from "../../../../store/hooks";
import { IUserDataState } from "../../../../types";
import { IErrorTenantDetail } from "../../../../types/index";

interface IData {
  createdDateTime: string;
  description: string;
  host: string;
  id: number;
  policy: string;
  port: number;
  tenantDbName: string;
  tenantId: number;
  tenantName: string;
}

const TenantProfile = () => {
  const user: IUserDataState = useSelector(
    (state: RootState) => state.userData
  );
  const [edit, setEdit] = useState(false);
  const dispatch = useAppDispatch();
  const [tenant, setTenant] = useState<IData>({
    createdDateTime: "",
    description: "",
    host: "",
    id: 0,
    policy: "",
    port: 0,
    tenantDbName: "",
    tenantId: 0,
    tenantName: "",
  });
  const [error, setError] = useState<IErrorTenantDetail>({
    tenantName: "",
    tenantDbName: "",
  });
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "tenantName":
        setError({
          ...error,
          [name]: regexForName.test(value) ? "" : "Enter a valid tenantName",
        });
        break;
      // case "email":
      //   setError({
      //     ...error,
      //     [name]: regexForEmail.test(value) ? "" : "Enter a Valid Email",
      //   });
      //   break;
      case "tenantDbName":
        setError({
          ...error,
          [name]: regexForName.test(value)
            ? ""
            : "databaseName should only consist Alphabets",
        });
        break;

      default:
        break;
    }
    setTenant({ ...tenant, [name]: value });
  };
  const handleValidate = () => {
    const validate = !!(error.tenantName === "" && error.tenantDbName === "");
    return validate;
  };
  const handleUpdateTenant = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // console.log(error);
    if (handleValidate()) {
      if (tenant.tenantName !== "" && tenant.tenantDbName !== "") {
        // const updated = { ...tenant };
        if (tenant.id !== undefined) {
          dispatch(updateTenant({ ...tenant }));
          setEdit(false);
          ToastAlert("Tenant Details Update", "success");
        }
      } else {
        ToastAlert("Please Fill All Fields", "warning");
      }
    }
  };
  useEffect(() => {
    // console.log(user.data);
    if (user.data) {
      setTenant(user.data);
    }
  }, [user.data]);
  return (
    <>
      <div className=" bg-white">
        <Container className="m-1">
          <h2 className="text-center pt-3 p-3">Tenant Details </h2>
          <Form className="p-4">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tenant Name :</Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Enter Name"
                    data-testid="name-input"
                    name="tenantName"
                    onChange={handleInputChange}
                    value={tenant.tenantName}
                    disabled={!edit}
                    isInvalid={!!error.tenantName}
                  />
                  {tenant.tenantName &&
                    !regexForName.test(tenant.tenantName) && (
                      <span className="text-danger">
                        Name Should Not Cantain Any Special Character or Number
                      </span>
                    )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Database Name :</Form.Label>

                  <Form.Control
                    type="text"
                    onChange={handleInputChange}
                    name="databaseName"
                    data-testid="databaseName-input"
                    disabled={!edit}
                    placeholder="Enter database name"
                    value={tenant.tenantDbName}
                    isInvalid={!!error.tenantDbName}
                  />
                  {tenant.tenantDbName &&
                    !regexForName.test(tenant.tenantDbName) && (
                      <span className="text-danger">
                        databaseName Should Not Cantain Any Special Character or
                        Number
                      </span>
                    )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Host :</Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="host"
                    // value={tenant.host}
                    // defaultValue="193.168.0.1"
                    data-testid="host-input"
                    value={tenant.host}
                    name="host"
                    onChange={handleInputChange}
                    disabled
                    // isInvalid={!!error.host}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Port :</Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="port"
                    // value={tenant.port}
                    // defaultValue="8989"
                    data-testid="port-input"
                    value={tenant.port}
                    name="port"
                    onChange={handleInputChange}
                    disabled
                    // isInvalid={!!error.port}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Description:</Form.Label>

                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={3}
                    className="form-control rounded-0"
                    data-testid="description-input"
                    // id="description"
                    placeholder="Here...."
                    value={tenant.description}
                    disabled={!edit}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              {edit ? (
                <Button
                  data-testid="update-button"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                    handleUpdateTenant(event)
                  }
                  className="mt-3 info ml-4"
                >
                  Update
                </Button>
              ) : (
                <Button
                  data-testid="edit-button"
                  onClick={() => setEdit(true)}
                  className="mt-3 info ml-4"
                >
                  Edit
                </Button>
              )}
            </Row>
          </Form>
        </Container>
      </div>
    </>
  );
};
export default TenantProfile;
