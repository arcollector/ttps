import { Button } from 'semantic-ui-react';

type Props = {
  label: string,
  onPreDelete: () => any,
  isDeleteMode: boolean,
  isLoading: boolean,
  onConfirm: () => any,
  onCancel: () => any,
};

export function FormDeletion(props: Props) {
  const {
    label,
    onPreDelete,
    isDeleteMode,
    isLoading,
    onConfirm,
    onCancel,
  } = props;

  return (
    <>
      {!isDeleteMode &&
      <Button
        className="negative"
        type="button"
        onClick={onPreDelete}
      >
        {label}
      </Button>
      }

      {isDeleteMode &&
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <h3 style={{ marginRight: 50 }}>Esta seguro?</h3>
        <Button
          className="negative"
          type="button"
          loading={isLoading}
          onClick={onConfirm}
        >
          Si
        </Button>
        <Button
          className="grey"
          type="button"
          onClick={onCancel}
        >
          No
        </Button>
      </div>
      }
    </>
  );
}
