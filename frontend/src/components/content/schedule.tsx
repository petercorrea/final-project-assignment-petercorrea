import Padding from '@/components/containers/padding';
import { Add } from '@/components/ui/add';
import { getAllSchedules } from '@/endpoints/schedule';
import { parseCronJob } from '@/root/libs/parsers';
import { setModalContent, toggleModal } from '@/root/stores/modal';
import { Detail, H1, P } from '@/typography/heading';
import { Card } from '@/ui/card';
import { Index, Match, Suspense, Switch, createResource } from 'solid-js';
import { CreateSchedule } from '../forms/create-schedule';
import { Settings } from '../ui/icons/icons';

export const Schedule = () => {
  const [schedules, { refetch: refetchSchedules }] =
    createResource(getAllSchedules);

  const onScheduleSettingsClick = (job, sensor) => {
    toggleModal(true);
    setModalContent(() => (
      <CreateSchedule
        job={parseCronJob(job, sensor)}
        refetch={refetchSchedules}
        onClose={() => toggleModal(false)}
        update
      />
    ));
  };

  const onAddScheduleClick = () => {
    toggleModal(true);
    setModalContent(() => (
      <CreateSchedule
        refetch={refetchSchedules}
        onClose={() => toggleModal(false)}
        create
      />
    ));
  };

  return (
    <Padding>
      <div class="flex flex-row justify-between items-center mb-4">
        <H1 class="w-min">Schedule</H1>
        <button onClick={() => onAddScheduleClick()}>
          <Add label="Create" />
        </button>
      </div>

      <Card>
        <Suspense fallback={<Detail>Loading...</Detail>}>
          <Switch>
            <Match when={schedules()?.error}>
              <Detail
                error
              >{`${String(schedules()?.error).slice(0, 30)}...`}</Detail>
            </Match>

            <Match when={!schedules.loading}>
              {Object.entries(schedules().jobs).length == 0 ? (
                <Detail>No schedules.</Detail>
              ) : (
                ''
              )}

              <Index each={Object.entries(schedules().jobs)}>
                {(sensor) => {
                  return (
                    <div class="flex flex-col items-start mb-4">
                      {/* sensor */}
                      <p class="capitalize font-medium">{sensor()[0]}</p>
                      <div class="flex flex-col justify-between w-full">
                        <Index each={sensor()[1]}>
                          {(job) => {
                            let sensorName = sensor()[0]
                            let parsedJob = parseCronJob(job(), sensorName)
                            return (
                              <div class="w-full flex flex-row justify-between items-center">
                                <P class="text-zinc-400 text-sm">
                                  {parsedJob.day !== '' ? `${parsedJob.day}` : ''}
                                  {parsedJob.time !== '' ? `, ${parsedJob.time}` : ''}
                                  {parsedJob.state !== '' ? `, ${parsedJob.state}` : ''}
                                  {parsedJob.details !== '' ? `, ${parsedJob.details}` : ''}
                                </P>
                                <button
                                  onClick={() => onScheduleSettingsClick(job(), sensorName)}
                                >
                                  <Settings height={30} width={30} />
                                </button>
                              </div>
                            );
                          }}
                        </Index>
                      </div>
                    </div>
                  );
                }}
              </Index>
            </Match>
          </Switch>
        </Suspense>
      </Card>
    </Padding>
  );
};
