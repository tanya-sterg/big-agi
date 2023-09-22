import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Divider } from '@mui/joy';

import { GoodModal } from '~/common/components/GoodModal';
import { useUIStateStore } from '~/common/state/store-ui';

import { apiQuery } from '~/modules/trpc/trpc.client';

import { DModelSourceId } from '../llm.types';
import { EditSources } from './EditSources';
import { LLMList } from './LLMList';
import { LLMOptions } from './LLMOptions';
import { VendorSourceSetup } from './VendorSourceSetup';
import { createDefaultModelSource } from '../vendor.registry';
import { useModelsStore, useSourceSetup } from '../store-llms';
import { openAIModelToDLLM } from '../openai/OpenAISourceSetup';
import { normalizeOAISetup, SourceSetupOpenAI } from '../openai/openai.vendor';



export function Configurator(props: { suspendAutoModelsSetup?: boolean }) {

  // local state
  const [_selectedSourceId, setSelectedSourceId] = React.useState<DModelSourceId | null>(null);

  // external state
  const { modelsSetupOpen, openModelsSetup, closeModelsSetup, llmOptionsId } = useUIStateStore();
  const { modelSources, llmCount } = useModelsStore(state => ({
    modelSources: state.sources,
    llmCount: state.llms.length,
  }), shallow);

  // auto-select the first source - note: we could use a useEffect() here, but this is more efficient
  // also note that state-persistence is unneeded
  const selectedSourceId = _selectedSourceId ?? modelSources[0]?.id ?? null;

  const activeSource = modelSources.find(source => source.id === selectedSourceId);


  // if no sources at startup, open the modal
  React.useEffect(() => {
    if (!selectedSourceId && !props.suspendAutoModelsSetup)
      openModelsSetup();
  }, [selectedSourceId, openModelsSetup, props.suspendAutoModelsSetup]);

  console.log(process.env)

  const {
    source, sourceLLMs, updateSetup,
    normSetup: { heliKey, oaiHost, oaiKey, oaiOrg, moderationCheck },
  } = useSourceSetup<SourceSetupOpenAI>(selectedSourceId, normalizeOAISetup);

  // fetch models
  const { isFetching, refetch, isError, error } = apiQuery.openai.listModels.useQuery({
    access: { oaiKey, oaiHost, oaiOrg, heliKey, moderationCheck },
    filterGpt: true,
  }, {
    enabled: !sourceLLMs.length,
    onSuccess: models => {
      //keep only gpt-4
      models = models.filter((item) => item.id.toLowerCase()=='gpt-4');
      const llms = source ? models.map(model => openAIModelToDLLM(model, source)) : [];
      useModelsStore.getState().addLLMs(llms);
    },
    staleTime: Infinity,
    refetchOnMount: 'always',
  });

  React.useEffect(() => {
    const models_store = useModelsStore.getState();
    if(!selectedSourceId && props.suspendAutoModelsSetup){
      // Seems to be working just for not displaying initial dialog and setting 
      // default model, and not for setting Ids - but it's not the best option 
      models_store.setChatLLMId('gpt-4');
      //models_store.setFastLLMId('gpt-4');
      //models_store.setFuncLLMId('gpt-4');
    }
  }, [selectedSourceId, openModelsSetup, props.suspendAutoModelsSetup]);

  // add the default source on cold - will require setup
  React.useEffect(() => {
    const { addSource, sources } = useModelsStore.getState();
    if (!sources.length)
      addSource(createDefaultModelSource(sources));
  }, []);


  return <>

    {/* Sources Setup */}
    <GoodModal title={<>Configure <b>AI Models</b></>} open={modelsSetupOpen} onClose={closeModelsSetup}>

      <EditSources selectedSourceId={selectedSourceId} setSelectedSourceId={setSelectedSourceId} />

      {!!activeSource && <Divider />}

      {!!activeSource && <VendorSourceSetup source={activeSource} />}

      {!!llmCount && <Divider />}

      {!!llmCount && <LLMList />}

      <Divider />

    </GoodModal>

    {/* per-LLM options */}
    {!!llmOptionsId && <LLMOptions id={llmOptionsId} />}

  </>;
}