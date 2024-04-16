import{u as v,j as e,r as N,B as A,R as le,_,M as ce,b as de,z as x,l as me,w as ue,A as J,E as R,c as T,s as he,d as pe,e as ge,f as xe,F as fe,g as f,h as w,I as D,L as Q,C as z,i as Y,k as Z,m as je,S as be,t as ye,U as we}from"./index-15e32b95.js";const _e=v.span`
  color: red;
`,y=()=>e.jsx(_e,{children:"*"}),Ce=v.div`
  input {
    display: none;
  }
`,ve=v.div`
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .file-row {
    display: flex;
    gap: 1rem;

    & > * {
      margin: auto 0 auto 0;
    }
  }

  img {
    --img-size: 3.5rem;
    height: var(--img-size);
    width: var(--img-size);
    object-fit: contain;
    border: 1px solid black;
  }
`,O=N.createContext({value:[],onChange:void 0}),C=({children:n,value:r,onChange:s})=>e.jsx(O.Provider,{value:{value:r,onChange:s},children:n}),Se="ffd8ff",Ne="89504e47",ee=["52494646","57454250"],Ie=({maxFiles:n,name:r})=>{const{value:s,onChange:a}=N.useContext(O),o=N.useRef(null),l=async d=>{if(s.length+d.length>n){_.error(n===1?"You can select only one image":`Max ${n} images allowed in this field`,{id:"max files allowed"});return}const j=[];for(let p=0;p<d.length;p++)if(d[p].size>ce){_.error(`Max file size allowed is ${de} KB`,{id:"file type allowed"});return}for(let p=0;p<d.length;p++){const g=d[p],P=await new Response(g.slice(0,12)).arrayBuffer(),I=[...new Uint8Array(P)].map($=>$.toString(16).padStart(2,"0")).join("");let E=`${Date.now()}${p}`;if(g.type==="image/jpeg"||g.type==="image/jpg"){if(!I.startsWith(Se)){_.error(`Invalid image${d.length>1?"s":""}`,{id:"file type allowed"});return}E+=".jpg"}else if(g.type==="image/png"){if(!I.startsWith(Ne)){_.error(`Invalid image${d.length>1?"s":""}`,{id:"file type allowed"});return}E+=".png"}else if(g.type==="image/webp"){if(!(I.startsWith(ee[0])&&I.endsWith(ee[1]))){_.error(`Invalid image${d.length>1?"s":""}`,{id:"file type allowed"});return}E+=".webp"}else{_.error("Only jpeg, png and webp type images are allowed",{id:"file type allowed"});return}const V=new File([g],E,{type:g.type});j.push(V)}const b=[...j,...s],h=new DataTransfer;b.forEach(p=>h.items.add(p)),a==null||a(b)},c=async()=>{const d=o.current;if(d){const j=d.files;j&&await l(j),d.value="",d.files=new DataTransfer().files}};return e.jsxs(Ce,{children:[e.jsxs(A,{type:"button",disabled:s.length===n,onClick:()=>{var d;(d=o.current)==null||d.click()},children:["Select image",n===1?"":"s"]}),e.jsx("input",{ref:o,name:r,id:r,multiple:n>1,type:"file",onChange:c,accept:"image/*"})]})},Ee=()=>{const{value:n,onChange:r}=N.useContext(O);return n.length!==0?e.jsx(ve,{children:n.map(s=>{const a=URL.createObjectURL(s);return e.jsxs("div",{className:"file-row",children:[e.jsx("img",{src:a,alt:""}),e.jsx(A,{type:"button",$type:"danger",onClick:()=>{const o=n.filter(c=>c!==s),l=new DataTransfer;o.forEach(c=>l.items.add(c)),r==null||r(o)},children:e.jsx(le,{})})]},s.name)})}):null};C.Input=Ie;C.Display=Ee;const ke=n=>{n.key==="Enter"&&n.target instanceof HTMLInputElement&&n.preventDefault()},Me="Home name is required",ne="Name should be 2-50 characters long",Ae="Address is required",te="Address should be 3-90 character long",Ve="Description is required",ie="Description should be 10-1500 characters long",re="Price is required",se="Price per guest is required",ae=4,q=10,S=x.object({name:x.string({required_error:Me}).min(2,ne).max(50,ne),location:x.string().min(1,"Location is required").refine(n=>me(n),"Provide valid coordinates").transform(n=>ue(n)),address:x.string({required_error:Ae}).min(3,te).max(90,te),price:x.string({required_error:re}).min(1,re).transform(n=>n===""?null:n).nullable().refine(n=>n===null||!isNaN(Number(n)),{message:"Price must be a number"}),price_per_guest:x.string({required_error:se}).min(1,se).transform(n=>n===""?null:n).nullable().refine(n=>n===null||!isNaN(Number(n)),{message:"Price per guest must be a number"}),number_of_cabins:x.number({coerce:!0}).int().min(1).max(50),cabin_capacity:x.number({coerce:!0}).int().min(1).max(50),amenities:x.enum(J).array().max(J.length).default([]),description:x.string({required_error:Ve}).min(10,ie).max(1500,ie),main_image:x.any().array().length(1,{message:"Main image is required"}),extra_images:x.any().array().min(ae,`Please select atleast ${ae} extra images`).max(q,`Max ${q} extra images allowed`)}),De=(n,r)=>{const s=[];for(let a=0;a<r.length;a++)r.charAt(a)===n&&s.push(a);return s},$e=async(n,r)=>{const{main_image:s,extra_images:a,...o}=n,l=await fetch("/api/v1/home/create",{mode:"cors",method:"POST",headers:{"Content-Type":"application/json"},cache:"no-cache",body:JSON.stringify({...o,images:r})}),c=await l.json();if(!l.ok)throw new R(c.message,l.status)},ze=async({main_image:n,extra_images:r,...s})=>{const a=r.length+1,o=await fetch(`/api/v1/home/create/verify/${a}`,{method:"POST",headers:{"Content-Type":"application/json"},cache:"no-cache",body:JSON.stringify({...s})}),l=await o.json();if(!o.ok)throw new R((l==null?void 0:l.message)??"There was an error verifying your home data",o.status);return l},Re=async(n,r,s,a)=>{let o=new FormData;s.key=r,s["Content-Type"]=a.type,Object.keys(s).forEach(c=>{o.append(c,s[c])}),o.append("file",a);const l=await fetch(n,{method:"POST",body:o});if(!l.ok)throw new R("There was an error uploading the file",l.status);return l},Pe=async(n,r)=>{const{url:s,prefix:a,fields:o}=r,l=n.map(c=>a+c.name);for(let c=0;c<n.length;c++)await Re(s,l[c],o,n[c]),await new Promise(d=>setTimeout(d,500));return l},Te=v.div`
  padding: 50px 5%;
  font-size: 0.8rem;

  & > * {
    margin-left: auto;
    margin-right: auto;
  }

  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }

  form {
    /* width: 60%; */
    max-width: 50rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .map-link {
    font-size: 1rem;
    text-decoration: underline;
    color: black;
    white-space: nowrap;
  }

  .amenities-display {
    /* margin: auto; */
    resize: none;
    height: min-content;
    font-size: 1rem;
    line-height: 1.5;
    /* min-height: 0; */
    width: 100%;
    overflow: hidden;
    border: none;
    border: 1px solid black;
    outline: none;
  }

  .description-field {
    resize: none;
    font-size: 1rem;
    min-height: 1rem;
    max-height: 8rem;
    width: 100%;
    padding: 0.5rem;
    /* padding: 0; */
    margin: 0;
    /* box-sizing: border-box; */
    /* overflow: hidden; */
  }

  .submit-button {
    margin: auto;
  }
`,qe=v.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
`,i=v.div.attrs({className:"grid-cell"})`
  box-sizing: border-box;
  min-height: 5rem;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  border-top: 2px solid rgba(204, 204, 204, 0.5);
  & > * {
    margin-top: auto;
    margin-bottom: auto;
  }

  &:nth-of-type(1),
  &:nth-of-type(2) {
    border: none;
  }

  ${n=>{if(n.$fileCell)return T`
        border: none;
        min-height: 0;
        padding-top: 0;
        padding-bottom: 0;
        grid-column: 2 / 2;
      `;if(n.$noteCell)return T`
        min-height: 0;
        grid-column: 1 / -1;
        p {
          margin: auto;
          padding: 1rem;
          font-size: 1rem;
          background-color: #fffaa0;
          border-radius: 10px;
        }
      `;if(n.$spanRow)return T`
        min-height: 0;
        grid-column: 1 / -1;
        p {
          margin: auto;
          padding: 1rem;
          font-size: 1rem;
        }
      `}}
`,Oe=v.div`
  background-color: white;
  max-height: 90svh;
  display: flex;
  flex-direction: column;

  .header {
    flex: none;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgb(0, 0, 0, 0.5);
    position: relative;

    h2 {
      text-align: center;
    }
  }

  .footer {
    flex: none;
    padding: 0.5rem;
    display: flex;
    gap: 2rem;
    border-top: 1px solid rgb(0, 0, 0, 0.5);

    & > *:first-child {
      margin-left: auto;
    }

    & > *:last-child {
      margin-right: auto;
    }
  }

  .box {
    flex: 0 1 auto;
    padding: 20px 50px;
    box-sizing: border-box;
    overflow-y: auto;

    fieldset {
      border: 0;

      legend {
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }

      .list {
        display: grid;
        /* grid-template-columns: min-content min-content; */
        grid-template-columns: repeat(2, minmax(min-content, 1fr));
        gap: 20px;

        .row {
          display: flex;
          align-items: center;
          gap: 1rem;

          label {
            font-size: 1rem;
          }

          input[type='checkbox'] {
            height: 1.2rem;
            aspect-ratio: 1;
            /* outline: 3px solid black; */
          }
        }
      }
    }
  }

  @media (max-width: ${he.phone}px) {
    .box {
      padding: 20px;
    }
  }
`,Fe=v.div`
  padding: 30px;
  border-radius: 1rem;
  background-color: white;
  font-size: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h3 {
    font-size: 1.5rem;
    text-align: center;
  }

  p {
    font-size: 1.1rem;
  }

  .custom-spinner {
    font-size: 0.04rem;
    /* height: 3.5rem; */
  }
`,Be=n=>{const r=n.target;r.style.height="auto";const s=r.scrollHeight,a=window.getComputedStyle(r,null).getPropertyValue("padding-top");r.style.height=`calc(${s}px - ${a}*2)`},He=()=>{var B,L,H,U,G,W,K,X;const n=pe(),r=ge({defaultValues:{amenities:[]},resolver:ye(S)}),s=xe(),[a,o]=N.useState(!1),[l,c]=N.useState(!1),[d,j]=N.useState(""),{register:b,formState:{errors:h},setValue:p,control:g,handleSubmit:P,watch:I}=r,E=async t=>{c(!0);try{j("Verifying data....");const m=await ze(t);j("Uploading images....");const u=[...t.main_image,...t.extra_images],k=await Pe(u,m);j("Uploading your home info...."),await $e(t,k),_.success("Your home details was sent to the verification team",{duration:5500}),n.setQueryData(["current-user"],M=>M&&{...M,role:we.OWNER}),s("/",{replace:!0})}catch(m){let u="There was some internal server error";m instanceof R&&(u=m.message),_.error(u)}finally{c(!1),j("")}},V=I("amenities"),$=t=>m=>{let u=m.target.value;if(u=u.replace(/[^0-9.]/g,""),u.length===0){p(t,"");return}const k=De(".",u);if(k.length!==0){k.length>1&&(u=u.slice(0,k[1]));const M=k[0],oe=u.substring(M+1);u=u.substring(0,M+1)+oe.substring(0,2)}p(t,u,{shouldValidate:!0})},F=t=>m=>{let u=m.target.value;u=u.replace(/[^0-9.]/g,""),u.length!==0&&p(t,parseFloat(u).toString(),{shouldValidate:!0})};return e.jsxs(Te,{children:[e.jsx("h1",{children:"Register your home on StayEasy!"}),e.jsx(fe,{...r,children:e.jsxs("form",{onSubmit:P(E),onKeyDown:ke,children:[e.jsxs(qe,{children:[e.jsx(i,{children:e.jsx(f,{htmlFor:"name",children:(B=h.name)!=null&&B.message?e.jsx(w,{children:h.name.message}):e.jsxs("span",{children:["Home name",e.jsx(y,{})]})})}),e.jsx(i,{children:e.jsx(D,{type:"text",id:"name",autoComplete:"off",...b("name")})}),e.jsx(i,{$noteCell:!0,children:e.jsxs("p",{children:["Note: Right click at a location on the"," ",e.jsx(Q,{to:"https://www.google.com/maps",target:"_blank",rel:"noopener noreferrer",className:"map-link",children:"map"})," ","and select the first option."]})}),e.jsx(i,{children:e.jsx(f,{htmlFor:"location",children:(L=h.location)!=null&&L.message?e.jsx(w,{children:h.location.message}):e.jsxs("span",{children:["Location",e.jsx(y,{})]})})}),e.jsx(i,{children:e.jsx(D,{type:"text",id:"location",...b("location")})}),e.jsx(i,{children:e.jsx(f,{htmlFor:"address",children:(H=h.address)!=null&&H.message?e.jsx(w,{children:h.address.message}):e.jsxs("span",{children:["Complete Address",e.jsx(y,{})]})})}),e.jsx(i,{children:e.jsx(D,{type:"text",id:"address",...b("address")})}),e.jsx(i,{children:e.jsx(f,{htmlFor:"price",children:(U=h.price)!=null&&U.message?e.jsx(w,{children:h.price.message}):e.jsxs("span",{children:["Price (₹)",e.jsx(y,{})]})})}),e.jsx(i,{children:e.jsx(D,{type:"text",id:"price",defaultValue:"",...b("price",{onChange:$("price"),onBlur:F("price")})})}),e.jsx(i,{children:e.jsx(f,{htmlFor:"price_per_guest",children:(G=h.price_per_guest)!=null&&G.message?e.jsx(w,{children:h.price_per_guest.message}):e.jsxs("span",{children:["Price per Guest (₹)",e.jsx(y,{})]})})}),e.jsx(i,{children:e.jsx(D,{type:"text",id:"price_per_guest",defaultValue:"",...b("price_per_guest",{onChange:$("price_per_guest"),onBlur:F("price_per_guest")})})}),e.jsx(i,{$noteCell:!0,children:e.jsx("p",{children:"Note: 5% of the total price will be charged additionaly by StayEasy."})}),e.jsx(i,{children:e.jsxs(f,{htmlFor:"number_of_cabins",children:["Number of cabins",e.jsx(y,{})]})}),e.jsx(i,{children:e.jsx(z,{control:g,name:"number_of_cabins",defaultValue:S.shape.number_of_cabins.minValue??1,render:({field:t})=>e.jsx(Y,{name:"number_of_cabins",min:S.shape.number_of_cabins.minValue??1,max:S.shape.number_of_cabins.maxValue??50,value:t.value,onValChange:m=>{t.onChange(m)}})})}),e.jsx(i,{children:e.jsx(f,{htmlFor:"cabin_capacity",children:"Cabin Capacity"})}),e.jsx(i,{children:e.jsx(z,{control:g,name:"cabin_capacity",defaultValue:S.shape.cabin_capacity.minValue??1,render:({field:t})=>e.jsx(Y,{name:"cabin_capacity",min:S.shape.cabin_capacity.minValue??1,max:S.shape.cabin_capacity.maxValue??50,value:t.value,onValChange:m=>{t.onChange(m)}})})}),e.jsx(i,{children:e.jsx(f,{htmlFor:"amenities",children:"Amenities"})}),e.jsxs(i,{children:[e.jsx(A,{type:"button",onClick:()=>o(!0),children:"Select amenities"}),V.length>0&&e.jsx("p",{children:V.join(", ")}),e.jsx(Z,{isModalOpen:a,setIsModalOpen:o,children:e.jsxs(Oe,{children:[e.jsx("div",{className:"header",children:e.jsx("h2",{children:"Amenities"})}),e.jsx("div",{className:"box",children:e.jsx("fieldset",{children:e.jsx("div",{className:"list",children:je.map(t=>e.jsxs("div",{className:"row",children:[e.jsx("input",{type:"checkbox",value:t.label,id:t.value,...b("amenities")}),e.jsx("label",{htmlFor:t.value,children:t.label})]},t.value))})})}),e.jsxs("div",{className:"footer",children:[e.jsx(A,{type:"button",onClick:()=>p("amenities",[],{shouldDirty:!0}),disabled:V.length===0,children:"Clear all"}),e.jsx(A,{type:"button",onClick:()=>o(!1),children:"OK"})]})]})})]}),e.jsx(i,{$noteCell:!0,children:e.jsxs("p",{children:["Note: Max file size allowed for an image is 200KB. Visit"," ",e.jsx(Q,{to:"https://image.pi7.org/download-compress-image/en",target:"_blank",rel:"noopener noreferrer",className:"image-compress-link",children:"this link"})," ","to compress images."]})}),e.jsx(i,{children:e.jsx(f,{htmlFor:"main_image",children:(W=h.main_image)!=null&&W.message?e.jsx(w,{children:h.main_image.message}):e.jsxs("span",{children:["Main Image",e.jsx(y,{})]})})}),e.jsx(z,{control:g,name:"main_image",defaultValue:[],render:({field:t})=>e.jsxs(C,{value:t.value,onChange:m=>{t.onChange(m)},children:[e.jsx(i,{children:e.jsx(C.Input,{maxFiles:1,name:"main_image"})}),e.jsx(i,{$fileCell:!0,children:e.jsx(C.Display,{})})]})}),e.jsx(i,{children:e.jsx(f,{htmlFor:"extra_images",children:(K=h.extra_images)!=null&&K.message?e.jsx(w,{children:h.extra_images.message}):e.jsxs("span",{children:["Extra Images",e.jsx(y,{})]})})}),e.jsx(z,{control:g,name:"extra_images",defaultValue:[],render:({field:t})=>e.jsxs(C,{value:t.value,onChange:m=>{t.onChange(m)},children:[e.jsx(i,{children:e.jsx(C.Input,{maxFiles:q,name:"extra_images"})}),e.jsx(i,{$fileCell:!0,children:e.jsx(C.Display,{})})]})}),e.jsx(i,{children:e.jsx(f,{htmlFor:"description",children:(X=h.description)!=null&&X.message?e.jsx(w,{children:h.description.message}):e.jsxs("span",{children:["Description",e.jsx(y,{})]})})}),e.jsx(i,{children:e.jsx("textarea",{id:"description",className:"description-field",...b("description",{required:"Description in required",validate:t=>t.length<10||t.length>1500?"Description should be 10-1500 characters long.":!0,onChange:t=>{const m=t.target.value;p("description",m.replace(/[\r\n\v]+/g,"").replace(/\s+/g," ")),Be(t)},onBlur:t=>{const m=t.target.value;p("description",m.trim())}})})}),e.jsx(i,{$noteCell:!0,children:e.jsx("p",{children:"Note: It may take upto 2 business days to verify your home."})})]}),e.jsx(A,{className:"submit-button",children:"Submit"}),e.jsx(Z,{isModalOpen:l,closable:!1,children:e.jsxs(Fe,{children:[e.jsx("h3",{children:"Submitting....."}),e.jsx("p",{children:d}),e.jsx(be,{color:"black"})]})})]})})]})};export{He as default};
