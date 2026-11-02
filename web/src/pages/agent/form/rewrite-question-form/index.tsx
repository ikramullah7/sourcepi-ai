import { MessageHistoryWindowSizeFormField } from '@/components/message-history-window-size-item';
import { ModelTreeSelectFormField } from '@/components/model-tree-select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SelectWithSearch } from '@/components/originui/select-with-search';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { initialRewriteQuestionValues } from '../../constant';
import { useFormValues } from '../../hooks/use-form-values';
import { useWatchFormChange } from '../../hooks/use-watch-form-change';
import { INextOperatorForm } from '../../interface';
import { useOwnerTenantId } from '../../context';
import { GoogleLanguageOptions } from '../../options';

const RewriteQuestionForm = ({ node }: INextOperatorForm) => {
  const defaultValues = useFormValues(initialRewriteQuestionValues, node);
  const form = useForm({ defaultValues });
  useWatchFormChange(node?.id, form);
  const { t } = useTranslation();
  const ownerTenantId = useOwnerTenantId();

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <ModelTreeSelectFormField
          name="llm_id"
          label={t('chat.model')}
          tooltip={t('chat.modelTip')}
          ownerTenantId={ownerTenantId}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel tooltip={t('chat.languageTip')}>
                {t('chat.language')}
              </FormLabel>
              <FormControl>
                <SelectWithSearch
                  options={GoogleLanguageOptions}
                  allowClear={true}
                  {...field}
                ></SelectWithSearch>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <MessageHistoryWindowSizeFormField></MessageHistoryWindowSizeFormField>
      </form>
    </Form>
  );
};

export default RewriteQuestionForm;
