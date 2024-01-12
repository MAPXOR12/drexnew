"use client";
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { BsCardImage, BsCheck, BsDiscord, BsEye, BsPlus, BsTextLeft, BsX} from 'react-icons/bs';
import { CardData } from '@/lib/types/CardData';
import ColorPicker from '@/components/input/ColorPicker';
import { CardFonts } from '@/lib/types/CardFonts';
import { CardFont } from '@/lib/types/CardFont';
import Channels from '@/components/input/Channels';
import TextBox from '@/components/input/TextBox';
import { useContext } from 'react';
import DashboardActionContext from '@/context/DashboardActionContext';
import Link from 'next/link';

type CardBody = Omit<CardData, 'rules' | 'channel'> & { rulesField: { rule: string }[] } & { channelID: string };
export default function DashboardCardsConfig({ id }: { id: string }) {
    const { register, handleSubmit, control, getValues, watch, reset } = useForm<CardBody>();
    const actionContext = useContext(DashboardActionContext);
    const { fields: rules, append, remove } = useFieldArray({
        name: "rulesField",
        control,
        rules: {
            maxLength: 25
        }
    });
    function createLink() {
        const values = getValues();
        console.log(values.rulesField)
        window.open(`/dashboard/${id}/cardPreview?bg_color1=${values.background?.color1 ?? '000000'}&bg_color2=${values.background?.color2 ?? '000000'}&bg_gradient=${values.background?.gradient}&description=${values.description?? ""}&dark=${values.dark ?? "false"}&header_font=${values.header_font ?? "BAUHAUS_93"}&text_font=${values.text_font ?? "ROBOTO"}&description=${values.description ?? ""}&channelID=${values.channelID}${values.rulesField.map((i) => `&rules=${i.rule}`).join('')}`, "_blank", "noreferrer")
    }
    function onSubmit(data: CardBody) {
        let body = new URLSearchParams();
        body.append('bg_color1', data?.background?.color1 || "");
        body.append('bg_color2', data?.background?.color2 || "");
        body.append('bg_gradient', data?.background?.gradient?.toString() || "");
        body.append('dark', data?.dark?.toString() || "");
        body.append('description', data?.description || "");
        data?.rulesField.forEach((i) => body.append('rules', i.rule || ""));
        body.append('channelID', data?.channelID);
        body.append('header_font', data?.header_font?.toString() || "");
        body.append('text_font', data?.text_font?.toString() || "");
        body.append('invite_url', data?.invite_url?.toString() || "");
        fetch(`/api/v1/servers/${id}/updateCard`, { method: 'POST', body }).then(async (data) => {
            const json = await data.json().catch(() => actionContext ? actionContext.setAction({ status: "error receiving data!", success: false }) : {});
            if (json && !json['error']) {
                if (actionContext)
                    actionContext.setAction({ status: <>Your card has been updated. Changes will be live at <Link className={"text-blue-500 hover:text-blue-300"} href={`${process.env.NEXT_PUBLIC_URL}/cards/${id}`}>{`${process.env.NEXT_PUBLIC_URL}/cards/${id}`}</Link></>, success: true })
                reset();
            } else {
                if (actionContext)
                    actionContext.setAction({ status: `An error occurred. Error: ${json['error'] || "Couldn't find error."}`, success: false });
            }
        }).catch(() => {})
    }
    const header = watch('header_font'),
    text = watch('text_font');

    return (<main className={"bg-gray-950 flex-grow"}>
        <div className={"animate-fadeIn flex max-md:items-center flex-col py-5 md:px-5 gap-5"}>
        <h1 className={"header text-6xl max-md:text-5xl"}>cards</h1>
        <span className={"flex flex-row max-md:flex-col gap-10 w-full"}>
        <div className={"bg-gray-800 flex-1 flex-grow flex-shrink-0 shadow-2xl border-2 border-gray-800 rounded-2xl h-fit w-full max-md:mx-auto"}>
    <h2 className={"bg-gray-900 secondary text-2xl p-4 text-center rounded-2xl rounded-b-none"}>Create/Edit Card</h2>

    <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-2 md:m-5 my-5"}>
        <label>Card Theme</label>
        <Controller control={control} name={'dark'} render={({ field }) => {
                return  <span onClick={() => field.onChange(!field.value)} className={"cursor-pointer flex w-fit gap-4 items-center flex-row justify-center font-open-sans text-lg max-md:mx-auto"}>
                <span className={`text-2xl border rounded-xl p-1 bg-gradient-to-bl ${field.value ? "from-gray-800 to-purple-900" : "from-blue-500 to-gray-50"} border-black select-none text-black transition-all`}>{field.value ? <BsCheck /> : <BsX/>}</span>
                    {field.value ? 'Dark' : 'Light'}
                </span>;
        }}/>
        <span className={"flex flex-col gap-2"}>
        <div>
        <label>Color 1 (Primary)</label>
        <Controller control={control} name={"background.color1"} render={({ field }) => {
            return <ColorPicker value={parseInt(field?.value ?? '0', 16)} string onChange={field.onChange}/>
        }}/> 
        </div>
        <div>
        <label>Color 2 (Secondary)</label>
        <Controller control={control} name={"background.color2"} render={({ field }) => {
        return <ColorPicker value={parseInt(field?.value ?? '0', 16)} string onChange={field.onChange}/>
        }}/>
        </div>
        </span>
        
        <label>Card Background Gradient</label>
        <select defaultValue={"background"} className={"w-fit rounded-xl text-lg font-open-sans"} {...register("background.gradient", { required: true })}>
            <option value={'BACKGROUND'}>Background Gradient</option>
            <option value={'LINEAR'}>Linear Gradient</option>
            <option value={'RADIAL'}>Radial Gradient</option>
        </select>
        <label>Header Font</label>
        <select defaultValue={"BAUHAUS_93"} className={`w-fit rounded-xl text-lg font-${CardFonts[header as CardFont]}`} {...register("header_font", { required: true })}>
            {Object.keys(CardFonts).map((i) => <option value={i} key={i} className={`font-${CardFonts[i as CardFont]}`}>{i.split('_').map((i) => i[0].toLocaleUpperCase() + i.slice(1).toLocaleLowerCase()).join(' ')}</option>)}
        </select>
        <label>Text Font</label>
        <select defaultValue={"ROBOTO"} className={`w-fit rounded-xl text-lg font-${CardFonts[text as CardFont]}`} {...register("text_font", { required: true })}>
            {Object.keys(CardFonts).map((i) => <option value={i} key={i} className={`font-${CardFonts[i as CardFont]}`}>{i.split('_').map((i) => i[0].toLocaleUpperCase() + i.slice(1).toLocaleLowerCase()).join(' ')}</option>)}
        </select>
        <label>Description</label>
        <textarea className={`font-${CardFonts[text as CardFont] ?? 'open-sans'} rounded-xl p-1`} maxLength={500} rows={4}  {...register("description", { required: true })}/>
        <label>Featured Channel</label>
        <Controller control={control} name={"channelID"} render={({ field }) => {
            return <Channels serverID={id} value={field.value} onChange={(e) => field.onChange(e.channel)}/>
        }}/>
        <label>Invite URL</label>
        <Controller name={`invite_url`} control={control} render={({ field }) => {
                    const tested = /^https:\/\/discord\.gg\/(invite\/|)\w{8}$/.test(field.value || '');
                    return  <span className={`w-fit ${tested ? 'text-green-500' : (field.value?.length || 0) > 10 ? 'text-red-500' : ''}`}><TextBox Icon={BsDiscord} maxLength={60} value={field.value} onChange={(e) => field.onChange(e.currentTarget.value)}/></span>
        } }/>
        <label>Server Rules</label>
                <span className={"secondary text-xl text-gray-300 flex flex-row items-center gap-2 my-3 mx-auto"}><span className={"border text-white rounded-2xl w-fit p-1 hover-gradient transition-all hover:text-black hover:border-black text-lg cursor-pointer"} onClick={() => rules.length < 10 ? append({ rule: '' }, { shouldFocus: false }) : {}}><BsPlus/></span> Add Rule</span>
        <div className={"flex flex-col gap-4"}>
            {rules.map((item, index) => <li key={item.id} className={"flex w-fit mx-auto gap-2 items-center"}>
                <Controller name={`rulesField.${index}.rule`} control={control} render={({ field }) => {
                    return <span><TextBox Icon={BsTextLeft} value={field.value} maxLength={40} onChange={(e) => field.onChange(e.currentTarget.value)} /></span>
                } }/>
                <span className={"border text-white rounded-2xl w-fit p-1 hover-gradient transition-all hover:text-black hover:border-black text-lg cursor-pointer mx-auto"} onClick={() => remove(index)}><BsX/></span>
            </li>)}
        </div>
        <button className={`secondary text-xl mx-auto hover-gradient border-white hover:text-black hover:border-black transition-all w-fit border rounded-xl p-1 flex flex-row gap-2 items-center`} type="submit">
            <BsCardImage/> Create/Edit Card
        </button>
    </form>
    
    </div>
    <div className={"bg-gray-800 flex-1 flex-grow flex-shrink-0 shadow-2xl border-2 border-gray-800 rounded-2xl h-fit w-full max-md:mx-auto pb-4"}>
        <h2 className={"bg-gray-900 secondary text-2xl p-4 text-center rounded-2xl rounded-b-none"}>Card Preview</h2>
        <p className={"text-md font-open-sans text-center p-2"}>You can go to your card preview link by clicking the button down below. This will display a preview version of your Card settings for you to look at and share with other Administrators on your server.</p>
        <span className={`secondary text-xl mx-auto hover-gradient cursor-pointer border-white hover:text-black hover:border-black transition-all w-fit border rounded-xl p-1 flex flex-row gap-2 items-center`} onClick={createLink}><BsEye/> Open Preview</span>
    </div>
        </span>
        </div>
        
            
        </main>)
}