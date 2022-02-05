import React, {
    memo,
    FC,
    CSSProperties,
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
    useRef,
    Ref,
    createRef,
} from 'react'
import {
    Handle,
    Position,
    NodeProps,
    Connection,
    Edge,
    XYPosition,
} from 'react-flow-renderer'

import { render } from 'react-dom'
import { v4 as uuidv4 } from 'uuid'
import { StringField } from './FieldComponents/StringField'
import { Container } from './styles'

interface iFieldData {
    [key: string]: string
}

// https://www.carlrippon.com/react-forwardref-typescript/
// https://stackoverflow.com/questions/37949981/call-child-method-from-parent
// need to do a check that all the keys are unique
export const VariableNode = forwardRef<
    { getNodeData(): iFieldData[] },
    { data?: iFieldData[] }
>(({ data }, ref) => {
    const [fields, setFields] = useState<iFieldData[]>(data || [])
    const [count, setCount] = useState(1)

    const addField = () => {
        setFields([...fields, { key: `key ${count}`, value: `value ${count}` }])
        setCount(count + 1)
    }

    const updateField = (index: number, k: string, v: string) => {
        const f = [...fields]
        const item = { ...f[index] }
        item.key = k
        item.value = v
        f[index] = item
        setFields(f)
    }

    // The component instance will be extended with whatever you return from the callback passed
    // as the second argument
    useImperativeHandle(ref, () => ({
        getNodeData() {
            return fields
        },
    }))

    // https://stackoverflow.com/questions/43230622/reactjs-how-to-delete-item-from-list/43230714
    const deleteField = (id: string) => {
        setFields(fields.filter((el) => el.key !== id))
    }

    return (
        <Container>
            <button onClick={addField}>Add Text Field</button>
            {fields.map((field, index) => (
                <StringField
                    updateField={updateField}
                    del={deleteField}
                    index={index}
                    key={field.key}
                    k={field.key}
                    v={field.value}
                />
            ))}
        </Container>
    )
})

class BasicNode {
    id: string

    fields: iFieldData[]

    data: object = {}

    nodeData: any

    position: XYPosition

    updateFields(newFields: iFieldData[]) {
        this.fields = newFields
    }

    constructor(x: number, y: number, id?: string, data?: []) {
        this.id = id || uuidv4()
        this.position = { x, y }
        this.fields = data || []
        this.nodeData = createRef()
        this._set_data()
    }

    private _set_data() {
        this.data = {
            label: (
                <VariableNode
                    ref={this.nodeData}
                    data={this.fields}
                    // callback={this.updateFields.bind(this)}
                />
            ),
        }
    }

    public updateFieldData = () => {
        if (this.nodeData.current) {
            this.fields = [...this.nodeData.current.getNodeData()]
        }
    }

    public getFieldData = () => {
        this.updateFieldData()
        return this.fields
    }

    // here we look into our component and grab all the data we need
    public serialize = (): {
        [id: string]: {
            [key: string]: [value: string]
        }
    } => {
        if (this.nodeData.current) {
            const data = this.nodeData.current.getNodeData()
            const output: any = {}
            output[this.id] = {}
            data.forEach((element: iFieldData) => {
                output[this.id][element.key] = element.value
            })
            return output
        }
        return {}
    }
}

export default BasicNode