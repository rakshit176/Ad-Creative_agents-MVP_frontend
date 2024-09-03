// @ts-nocheck
import { observer } from 'mobx-react-lite';
import { Button } from '@blueprintjs/core';
import { useProject } from './project';
import { Cloud } from '@blueprintjs/icons';

export const CloudWarning = observer(() => {
  const project = useProject();
  if (project.cloudEnabled) {
    return null;
  }
  return (
    <div>
      <p style={{ color: '#fbb360' }}>
        Warning! Your data is saved locally only.
      </p>
      <Button
        fill
        intent="success"
        // onClick={() => {
        //   project.signIn();
        // }}
        icon={<Cloud />}
      >
        Enable cloud storage
      </Button>
    </div>
  );
});
